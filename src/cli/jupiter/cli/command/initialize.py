"""UseCase for initialising a workspace."""

from jupiter.cli.config import JupiterGuestMutationCommand
from jupiter.core.application.use_case.init import InitResult, InitUseCase
from jupiter.core.config import JupiterGuestMutationContext
from jupiter.framework.appform.cli.session_storage import SessionInfo
from jupiter.framework.secure import secure_class
from rich.console import Console
from rich.text import Text


@secure_class
class Initialize(JupiterGuestMutationCommand[InitUseCase, InitResult]):
    """UseCase class for initialising a workspace."""

    def _render_result(
        self,
        console: Console,
        context: JupiterGuestMutationContext,
        result: InitResult,
    ) -> None:
        self._session_storage.store(SessionInfo(auth_token_ext=result.auth_token_ext))

        rich_text = Text("Your recovery token is ")
        rich_text.append(result.recovery_token.token, style="bold green")
        rich_text.append("\nStore it in a safe place!", style="bold red")

        console.print(rich_text)

    @property
    def should_have_streaming_progress_report(self) -> bool:
        """Whether the main script should have a streaming progress reporter."""
        return False
