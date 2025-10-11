"""Command for logging in."""

from jupiter.cli.config import JupiterGuestReadonlyCommand
from jupiter.framework_new.app.cli.session_storage import SessionInfo
from jupiter.core.config import JupiterGuestReadonlyUseCaseContext
from jupiter.core.use_cases.login import LoginResult, LoginUseCase
from jupiter.framework_new.secure import secure_class
from rich.console import Console


@secure_class
class Login(JupiterGuestReadonlyCommand[LoginUseCase, LoginResult]):
    """Command for logging in."""

    def _render_result(
        self,
        console: Console,
        context: JupiterGuestReadonlyUseCaseContext,
        result: LoginResult,
    ) -> None:
        self._session_storage.store(SessionInfo(auth_token_ext=result.auth_token_ext))
