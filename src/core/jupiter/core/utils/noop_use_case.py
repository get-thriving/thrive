"""A use case that doesn't do anything."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterLoggedInReadonlyUseCase,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class NoOpArgs(UseCaseArgsBase):
    """NoOp args."""


class NoOpUseCase(JupiterLoggedInReadonlyUseCase[NoOpArgs, None]):
    """A use case that doesn't do anything."""

    async def _execute(
        self, context: JupiterLoggedInReadonlyContext, args: NoOpArgs
    ) -> None:
        """Execute the command's actions."""
        return None
