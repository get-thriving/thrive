"""Use case for starting an OAuth grant, once the user has consented."""

from jupiter.core.auth.sub.oauth_grant.client_id import OAuthClientId
from jupiter.core.auth.sub.oauth_grant.oauth_code_external import OAuthCodeExternal
from jupiter.core.auth.sub.oauth_grant.oauth_secret_plain import OAuthSecretPlain
from jupiter.core.auth.sub.oauth_grant.pkce_code_challenge import PkceCodeChallenge
from jupiter.core.auth.sub.oauth_grant.pkce_code_challenge_method import (
    PkceCodeChallengeMethod,
)
from jupiter.core.auth.sub.oauth_grant.resource import OAuthResource
from jupiter.core.auth.sub.oauth_grant.root import OAuthGrant
from jupiter.core.common.system_url import SystemUrl
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.secure import secure_class
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class OAuthGrantCreateArgs(UseCaseArgsBase):
    """OAuth grant create args."""

    client_id: OAuthClientId
    redirect_uri: SystemUrl
    resource: OAuthResource
    code_challenge: PkceCodeChallenge
    code_challenge_method: PkceCodeChallengeMethod


@use_case_result
class OAuthGrantCreateResult(UseCaseResultBase):
    """OAuth grant create result."""

    code: OAuthCodeExternal


@secure_class
@mutation_use_case()
class OAuthGrantCreateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
        OAuthGrantCreateArgs, OAuthGrantCreateResult
    ]
):
    """Use case for starting an OAuth grant, once the user has consented."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: OAuthGrantCreateArgs,
    ) -> OAuthGrantCreateResult:
        """Execute the command's action."""
        code_plain = OAuthSecretPlain.generate()
        grant = OAuthGrant.new_grant(
            ctx=context.domain_context,
            user_ref_id=context.user.ref_id,
            client_id=args.client_id,
            redirect_uri=args.redirect_uri,
            resource=args.resource,
            code_challenge=args.code_challenge,
            code_plain=code_plain,
        )
        grant = await uow.get_for(OAuthGrant).create(grant)
        return OAuthGrantCreateResult(
            code=OAuthCodeExternal(grant_ref_id=grant.ref_id, secret=code_plain)
        )
