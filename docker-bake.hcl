# Local and release image build. `mise run build:docker` sets ARCH and VERSION.
# One platform per invocation: `docker load` cannot import a multi-arch image.
# This file stays at the repo root so the build context is `.`. The Dockerfiles
# live in infra/docker/. A context of `..` from that directory is rejected by buildx.

variable "VERSION" {}

variable "ARCH" {
  default = "arm64"
}

group "default" {
  targets = [
    "webapi-srv",
    "webapi-cron",
    "api",
    "mcp",
    "cli",
    "docs",
    "webui",
    "published",
  ]
}

target "_common" {
  context    = "."
  platforms  = ["linux/${ARCH}"]
  output     = ["type=docker"]
}

target "_python" {
  inherits   = ["_common"]
  dockerfile = "infra/docker/python.Dockerfile"
}

target "_node" {
  inherits   = ["_common"]
  dockerfile = "infra/docker/node.Dockerfile"
}

target "webapi-srv" {
  inherits = ["_python"]
  target   = "webapi-srv"
  tags = [
    "jupiter/webapi-srv:latest-${ARCH}",
    "jupiter/webapi-srv:${VERSION}-${ARCH}",
  ]
}

# Keep this list aligned with WEBAPI_CRON_FOLDERS in tasks/_common.sh.
target "webapi-cron" {
  inherits = ["_python"]
  name     = "webapi-${cron}"
  matrix = {
    cron = [
      "gc-do-all",
      "clear-abandoned-users-do-all",
      "sync-google-user-data-do-all",
      "sync-apple-user-data-do-all",
      "gen-do-all",
      "schedule-external-sync-do-all",
      "search-index-backfill-do-all",
      "crm-backfill-do-all",
      "search-mutation-log-drain-do-all",
      "search-mutation-requeue-do-all",
      "stats-do-all",
    ]
  }
  target = "webapi-${cron}"
  tags = [
    "jupiter/webapi-${cron}:latest-${ARCH}",
    "jupiter/webapi-${cron}:${VERSION}-${ARCH}",
  ]
}

target "api" {
  inherits = ["_python"]
  target   = "api"
  tags = [
    "jupiter/api:latest-${ARCH}",
    "jupiter/api:${VERSION}-${ARCH}",
  ]
}

target "mcp" {
  inherits = ["_python"]
  target   = "mcp"
  tags = [
    "jupiter/mcp:latest-${ARCH}",
    "jupiter/mcp:${VERSION}-${ARCH}",
  ]
}

target "cli" {
  inherits = ["_python"]
  target   = "cli"
  tags = [
    "jupiter/cli:latest-${ARCH}",
    "jupiter/cli:${VERSION}-${ARCH}",
  ]
}

target "docs" {
  inherits = ["_python"]
  target   = "docs"
  tags = [
    "jupiter/docs:latest-${ARCH}",
    "jupiter/docs:${VERSION}-${ARCH}",
  ]
}

target "webui" {
  inherits = ["_node"]
  target   = "webui"
  tags = [
    "jupiter/webui:latest-${ARCH}",
    "jupiter/webui:${VERSION}-${ARCH}",
  ]
}

target "published" {
  inherits = ["_node"]
  target   = "published"
  tags = [
    "jupiter/published:latest-${ARCH}",
    "jupiter/published:${VERSION}-${ARCH}",
  ]
}
