"""Command for logging in."""

from jupiter.cli.config import JupiterGuestReadonlyCommand
from jupiter.core.application.use_case.login_local import (
    LoginLocalResult,
    LoginLocalUseCase,
)
from jupiter.core.config import JupiterGuestReadonlyContext
from jupiter.framework.appform.cli.session_storage import SessionInfo
from jupiter.framework.secure import secure_class
from rich.console import Console


@secure_class
class Login(JupiterGuestReadonlyCommand[LoginLocalUseCase, LoginLocalResult]):
    """Command for logging in."""

    def _render_result(
        self,
        console: Console,
        context: JupiterGuestReadonlyContext,
        result: LoginLocalResult,
    ) -> None:
        self._session_storage.store(SessionInfo(auth_token_ext=result.auth_token_ext))
