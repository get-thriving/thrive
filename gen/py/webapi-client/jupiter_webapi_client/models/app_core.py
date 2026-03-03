from enum import Enum


class AppCore(str, Enum):
    API = "api"
    CLI = "cli"
    WEBUI = "webui"

    def __str__(self) -> str:
        return str(self.value)
