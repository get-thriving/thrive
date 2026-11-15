"""Regenerate the pictures of the docs against a running Thrive instance.

Normally run through ``mise run build:docs-screenshots``, which starts a fresh
instance first. See README.md next to this file.
"""

import argparse
import json
import shutil
import sys
import tomllib
from pathlib import Path
from typing import Any

from capture import Capturer, Profile
from seed import Seeder
from templating import Context

_HERE = Path(__file__).parent


def _parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--config", type=Path, default=_HERE / "screenshots.toml")
    parser.add_argument("--webui-url", help="The Web UI of the instance")
    parser.add_argument("--webapi-url", help="The WebAPI of the instance")
    parser.add_argument(
        "--out-dir", type=Path, default=Path(".build-cache/docs-screenshots/out")
    )
    parser.add_argument(
        "--state-file",
        type=Path,
        default=Path(".build-cache/docs-screenshots/state.json"),
    )
    parser.add_argument("--docs-root", type=Path, default=Path("src/docs/material"))
    parser.add_argument(
        "--only",
        action="append",
        default=[],
        help="Shot names or prefixes; repeatable or comma separated",
    )
    parser.add_argument("--list", action="store_true", help="List the shots and exit")
    parser.add_argument(
        "--skip-seed",
        action="store_true",
        help="Reuse the data and user of an earlier run",
    )
    parser.add_argument(
        "--seed-only", action="store_true", help="Create the data and stop"
    )
    parser.add_argument(
        "--no-install", action="store_true", help="Leave the pictures in --out-dir"
    )
    parser.add_argument("--headed", action="store_true", help="Show the browser")
    return parser.parse_args()


def _selected(shots: list[dict[str, Any]], only: list[str]) -> list[dict[str, Any]]:
    wanted = [part for chunk in only for part in chunk.split(",") if part]
    if not wanted:
        return shots
    chosen = [
        s
        for s in shots
        if any(s["name"] == w or s["name"].startswith(w) for w in wanted)
    ]
    # A shot that continues the previous one needs it to run first.
    names = {s["name"] for s in chosen}
    for index, shot in enumerate(shots):
        if shot["name"] in names and shot.get("continue_from_previous") and index > 0:
            names.add(shots[index - 1]["name"])
    return [s for s in shots if s["name"] in names]


def main() -> int:
    """Seed, capture and install."""
    args = _parse_arguments()
    config: dict[str, Any] = tomllib.loads(args.config.read_text())
    shots: list[dict[str, Any]] = config["shot"]

    if args.list:
        for shot in shots:
            print(f"{shot['name']:40} {', '.join(shot['assets'])}")
        return 0
    if not args.webui_url or not args.webapi_url:
        print("--webui-url and --webapi-url are required", file=sys.stderr)
        return 2

    context = Context(timezone=config["user"]["timezone"])
    args.state_file.parent.mkdir(parents=True, exist_ok=True)
    if args.skip_seed:
        context.refs = json.loads(args.state_file.read_text())
    else:
        print("Seeding the demo workspace", file=sys.stderr)
        user = config["user"]
        workspace_features = config["workspace"]["features"]
        seeder = Seeder(args.webapi_url, context)
        seeder.init_user(user, workspace_features)
        seeder.run(config.get("seed", []))
        args.state_file.write_text(json.dumps(context.refs, indent=2))
    if args.seed_only:
        return 0

    chosen = _selected(shots, args.only)
    if not chosen:
        print("No shot matches --only", file=sys.stderr)
        return 2
    profiles = {name: Profile.from_config(p) for name, p in config["profile"].items()}
    print(f"Taking {len(chosen)} screenshots", file=sys.stderr)
    capturer = Capturer(
        args.webui_url, config["user"], profiles, args.out_dir, context, args.headed
    )
    results = capturer.capture_all(chosen)

    failed = {name: error for name, error in results.items() if error}
    if not args.no_install:
        for shot in chosen:
            if shot["name"] in failed:
                continue
            for asset in shot["assets"]:
                target = args.docs_root / asset
                target.parent.mkdir(parents=True, exist_ok=True)
                # copyfile writes through symlinks, which keeps the README's copies in sync.
                shutil.copyfile(args.out_dir / f"{shot['name']}.png", target)
    print(
        f"Done: {len(chosen) - len(failed)} ok, {len(failed)} failed", file=sys.stderr
    )
    for name, error in failed.items():
        print(f"  FAILED {name}: {error}", file=sys.stderr)
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
