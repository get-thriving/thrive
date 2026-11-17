"""Fills a fresh instance with the demo data from the config, through the WebAPI."""

import importlib
import inspect
import random
import sys
from typing import Any

from jupiter_webapi_client.api.application.init import sync_detailed as init_sync
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.init_args import InitArgs
from jupiter_webapi_client.models.init_result import InitResult
from templating import Context

# The init call is the one call that takes a guest token, as in the itests.
_GUEST_TOKEN = (
    "eyJhbGciOiJub25lIn0."
    "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTczNjI5MjEyNH0."
)  # nosec


class SeedError(Exception):
    """A seeding step failed."""


def _camel(snake: str) -> str:
    return "".join(part.capitalize() for part in snake.split("_"))


def _dig(value: Any, path: str) -> Any:
    """Follow a dotted path through dicts and lists (``entries.0.aspect.ref_id``)."""
    for part in path.split("."):
        if isinstance(value, list):
            value = value[int(part)]
        else:
            value = value[part]
    return value


def _matches(item: Any, where: dict[str, Any]) -> bool:
    """Check ``where`` conditions against an item.

    A condition is a dotted path and either a value to be equal to, a string
    starting with ``~`` (substring), or ``"!null"`` (present).
    """
    for path, expected in where.items():
        try:
            actual = _dig(item, path)
        except (KeyError, IndexError, TypeError):
            return False
        if expected == "!null":
            if actual is None:
                return False
        elif isinstance(expected, str) and expected.startswith("~"):
            if expected[1:] not in str(actual):
                return False
        elif actual != expected:
            return False
    return True


class Seeder:
    """Runs the ``[[seed]]`` steps of the config against a WebAPI."""

    def __init__(self, webapi_url: str, context: Context) -> None:
        """Set up the seeder for one WebAPI."""
        self._webapi_url = webapi_url
        self._context = context
        self._client: AuthenticatedClient | None = None

    # -- the user ---------------------------------------------------------

    def init_user(self, user: dict[str, Any], features: list[str]) -> None:
        """Create the demo user and its workspace."""
        guest = AuthenticatedClient(base_url=self._webapi_url, token=_GUEST_TOKEN)
        args = InitArgs.from_dict(
            {
                "user_email_address": user["email"],
                "user_name": user["name"],
                "user_timezone": user["timezone"],
                "user_feature_flags": user["features"],
                "auth_password": user["password"],
                "auth_password_repeat": user["password"],
                "user_birthday": user["birthday"],
                "user_birth_year": user["birth_year"],
                "workspace_name": user["workspace_name"],
                "workspace_root_aspect_name": user["root_aspect"],
                "workspace_first_schedule_stream_name": user["first_stream"],
                "workspace_feature_flags": features,
            }
        )
        response = init_sync(client=guest, body=args)
        if response.status_code != 200 or not isinstance(response.parsed, InitResult):
            raise SeedError(f"Could not create the user: {response.content!r}")
        self._client = AuthenticatedClient(
            base_url=self._webapi_url, token=response.parsed.auth_token_ext
        )

    # -- the steps --------------------------------------------------------

    def run(self, steps: list[dict[str, Any]]) -> None:
        """Run all the steps, in order."""
        for index, step in enumerate(steps):
            label = step.get("op") or step.get("action") or f"#{index}"
            print(f"  seed {index + 1}/{len(steps)}: {label}", file=sys.stderr)
            if "foreach" in step:
                for position, item in enumerate(self._context.render(step["foreach"])):
                    self._context.variables.update(
                        {"i": position, "item": item, "index": position}
                    )
                    self._run_one(step)
                for key in ("i", "item", "index"):
                    self._context.variables.pop(key, None)
            else:
                self._run_one(step)

    def _run_one(self, step: dict[str, Any]) -> None:
        if "action" in step:
            self._action(step)
        else:
            self._operation(step)

    def _operation(self, step: dict[str, Any]) -> None:
        assert self._client is not None, "init_user() must run first"
        module = importlib.import_module(f"jupiter_webapi_client.api.{step['op']}")
        leaf = step["op"].split(".")[-1]
        model_name = step.get("args_model", f"{leaf}_args")
        models = importlib.import_module(f"jupiter_webapi_client.models.{model_name}")
        args_class = getattr(models, step.get("args_class", _camel(model_name)))
        body = self._context.render(step.get("args", {}))
        if step.get("fill_unchanged"):
            for name, parameter in inspect.signature(
                args_class.__init__
            ).parameters.items():
                if (
                    name not in ("self", "ref_id", "additional_properties")
                    and parameter.default is inspect.Parameter.empty
                    and name not in body
                ):
                    body[name] = {"should_change": False}
        response = module.sync_detailed(
            client=self._client, body=args_class.from_dict(body)
        )
        if response.status_code != 200:
            raise SeedError(
                f"{step['op']} failed with {response.status_code}: {response.content!r}\n"
                f"  args: {body}"
            )
        result = response.parsed.to_dict() if response.parsed is not None else {}
        self._save(step, result)

    def _save(self, step: dict[str, Any], result: dict[str, Any]) -> None:
        saves = list(step.get("saves", []))
        if "save" in step:
            saves.append({"name": step["save"]})
        for save in saves:
            name = self._context.render(save["name"])
            if "path" not in save and "take" not in save:
                # Default: the id of what the call created.
                created = next(key for key in result if key.startswith("new_"))
                self._context.refs[name] = result[created]["ref_id"]
                continue
            try:
                source = _dig(result, save["path"]) if "path" in save else result
            except (KeyError, IndexError, TypeError):
                if save.get("optional"):
                    print(f"    nothing to save for {name}, skipped", file=sys.stderr)
                    continue
                raise
            where = self._context.render(save.get("where", {}))
            if save.get("all"):
                items = [item for item in source if _matches(item, where)]
                self._context.refs[name] = [
                    _dig(item, save["take"]) if "take" in save else item
                    for item in items
                ]
            else:
                if isinstance(source, list):
                    matching = [item for item in source if _matches(item, where)]
                    if not matching and save.get("optional"):
                        print(
                            f"    nothing to save for {name}, skipped", file=sys.stderr
                        )
                        continue
                    if not matching:
                        raise SeedError(
                            f"Nothing in {save['path']} matches {where} for {name}"
                        )
                    source = matching[0]
                self._context.refs[name] = (
                    _dig(source, save["take"]) if "take" in save else source
                )

    # -- the few things that are more than one call ------------------------

    def _action(self, step: dict[str, Any]) -> None:
        assert self._client is not None, "init_user() must run first"
        name = step["action"]
        if name == "backfill_history":
            self._backfill_history(step)
        else:
            raise SeedError(f"Unknown seed action {name!r}")

    def _backfill_history(self, step: dict[str, Any]) -> None:
        """Generate the tasks of the past days, and finish most of them."""
        from jupiter_webapi_client.api.gen.gen_do import sync_detailed as gen_do
        from jupiter_webapi_client.api.inbox_tasks.inbox_task_find import (
            sync_detailed as inbox_task_find,
        )
        from jupiter_webapi_client.api.inbox_tasks.inbox_task_update import (
            sync_detailed as inbox_task_update,
        )
        from jupiter_webapi_client.models.gen_do_args import GenDoArgs
        from jupiter_webapi_client.models.inbox_task_find_args import InboxTaskFindArgs
        from jupiter_webapi_client.models.inbox_task_update_args import (
            InboxTaskUpdateArgs,
        )

        client = self._client
        assert client is not None
        generator = random.Random(step.get("seed", 7))  # nosec B311
        for offset in range(step.get("days", 42), -1, -1):
            response = gen_do(
                client=client,
                body=GenDoArgs.from_dict(
                    {
                        "gen_even_if_not_modified": False,
                        "today": self._context.day(-offset),
                    }
                ),
            )
            if response.status_code != 200:
                raise SeedError(
                    f"gen failed for {offset} days ago: {response.content!r}"
                )
        today = self._context.day(0)
        found = inbox_task_find(client=client, body=InboxTaskFindArgs.from_dict({}))
        assert found.parsed is not None
        for entry in found.parsed.entries:
            task = entry.inbox_task.to_dict()
            due = task.get("due_date")
            if (
                task["status"] != "not-started"
                or not isinstance(due, str)
                or due >= today
            ):
                continue
            status = (
                "done"
                if generator.random() < step.get("done_ratio", 0.82)
                else "not-done"
            )
            body = {
                "ref_id": task["ref_id"],
                **{
                    field: {"should_change": False}
                    for field in (
                        "name",
                        "is_key",
                        "eisen",
                        "difficulty",
                        "actionable_date",
                        "due_date",
                    )
                },
                "status": {"should_change": True, "value": status},
            }
            update = inbox_task_update(
                client=client, body=InboxTaskUpdateArgs.from_dict(body)
            )
            if update.status_code != 200:
                raise SeedError(f"Could not finish a task: {update.content!r}")
