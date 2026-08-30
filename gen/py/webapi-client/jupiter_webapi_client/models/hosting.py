from enum import StrEnum


class Hosting(StrEnum):
    HOSTED_GLOBAL = "hosted-global"
    LOCAL = "local"
    SELF_HOSTED = "self-hosted"

    def __str__(self) -> str:
        return str(self.value)
