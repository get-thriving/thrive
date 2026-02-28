"""The Jupiter MCP server."""

import asyncio
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Union, cast

import dotenv
import uvicorn
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from jupiter.core.config import build_global_properties
from jupiter.framework.telemetry.local.local import LocalTelemetry
from jupiter.framework.telemetry.sentry.sentry import SentryTelemetry
from jupiter.framework.telemetry.telemetry import Telemetry
from rich import print as rich_print


@dataclass(frozen=True)
class JupiterMcpProperties:
    """The properties for the Jupiter MCP server."""

    host: str
    port: int
    sentry_dsn: str


def build_mcp_properties() -> JupiterMcpProperties:
    """Build the MCP properties from the environment."""

    def find_up_the_dir_tree(partial_path: Union[str, Path]) -> Path:
        last_here = None
        right_here = Path(os.path.relpath(__file__)).parent
        while True:
            if last_here == right_here:
                raise Exception(f"Critical error - missing config file {partial_path}")
            config_file = right_here / partial_path
            if config_file.exists():
                return config_file
            last_here = right_here
            right_here = right_here.parent

    project_config_path = find_up_the_dir_tree("Config.project")
    dotenv.load_dotenv(dotenv_path=project_config_path, verbose=True)

    host = cast(str, os.getenv("HOST"))
    port = int(cast(str, os.getenv("PORT")))
    sentry_dsn = cast(str, os.getenv("SENTRY_DSN"))

    return JupiterMcpProperties(
        host=host,
        port=port,
        sentry_dsn=sentry_dsn,
    )


async def main() -> None:
    """Application main function."""
    global_properties = build_global_properties()
    service_properties = build_mcp_properties()

    telemetry: Telemetry

    if (
        global_properties.env.is_live
        and global_properties.universe.hosting.is_hosted_global
    ):
        telemetry = SentryTelemetry(service_properties.sentry_dsn)
    else:
        telemetry = LocalTelemetry()

    telemetry.prepare()

    app = FastAPI(title="Jupiter MCP", version=str(global_properties.version))

    @app.get("/healthz")
    async def healthz() -> JSONResponse:
        """Health check endpoint."""
        return JSONResponse({"status": "ok"})

    rich_print("=" * 80)
    rich_print("Starting Jupiter MCP:")
    rich_print(f"  Version: {global_properties.version}")
    rich_print(f"  Universe: {global_properties.universe}")
    rich_print(f"  Environment: {global_properties.env}")
    rich_print(f"  Instance: {global_properties.instance}")
    rich_print(f"  Hosting: {global_properties.universe.hosting}")
    rich_print("=" * 80)

    config = uvicorn.Config(
        app,
        host=service_properties.host,
        port=service_properties.port,
    )
    server = uvicorn.Server(config)
    await server.serve()


def sync_main() -> None:
    """Run the main function synchronously."""
    asyncio.run(main())


if __name__ == "__main__":
    sync_main()
