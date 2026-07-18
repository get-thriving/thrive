"""Create an email task for integration tests."""

from jupiter.core.common.difficulty import Difficulty
from jupiter.core.common.eisen import Eisen
from jupiter.core.common.email_address import EmailAddress
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterCreateCrownEntityArgs,
    JupiterCreateCrownEntityUseCase,
)
from jupiter.core.env import Env
from jupiter.core.features import WorkspaceFeature
from jupiter.core.push_integrations.extra_info import PushGenerationExtraInfo
from jupiter.core.push_integrations.group import PushIntegrationGroup
from jupiter.core.push_integrations.sub.email.task import EmailTask
from jupiter.core.push_integrations.sub.email.task_collection import (
    EmailTaskCollection,
)
from jupiter.core.push_integrations.sub.email.user_name import EmailUserName
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class CreateEmailTaskForTestArgs(JupiterCreateCrownEntityArgs):
    """Arguments for creating an email task in tests."""

    subject: str


@use_case_result
class CreateEmailTaskForTestResult(UseCaseResultBase):
    """Result of creating an email task in tests."""

    new_email_task: EmailTask


@mutation_use_case([WorkspaceFeature.EMAIL_TASKS], exclude_globally=[Env.PRODUCTION])
class CreateEmailTaskForTestUseCase(
    JupiterCreateCrownEntityUseCase[
        CreateEmailTaskForTestArgs, CreateEmailTaskForTestResult
    ]
):
    """Create an email task for integration tests."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: CreateEmailTaskForTestArgs,
    ) -> CreateEmailTaskForTestResult:
        """Execute the command's action."""
        workspace = context.workspace
        push_integration_group = await uow.get_for(PushIntegrationGroup).load_by_parent(
            workspace.ref_id,
        )
        email_task_collection = await uow.get_for(EmailTaskCollection).load_by_parent(
            push_integration_group.ref_id,
        )

        new_email_task = EmailTask.new_email_task(
            context.domain_context,
            email_task_collection.ref_id,
            from_address=EmailAddress("sender@example.com"),
            from_name=EmailUserName("Sender"),
            to_address=EmailAddress("recipient@example.com"),
            subject=args.subject,
            body="Test email body",
            generation_extra_info=PushGenerationExtraInfo(
                timezone=context.user.timezone,
                name=None,
                status=None,
                eisen=Eisen.REGULAR,
                difficulty=Difficulty.EASY,
                actionable_date=None,
                due_date=None,
            ),
        )
        new_email_task = await self.create_entity(
            context.domain_context,
            uow,
            progress_reporter,
            context.user.ref_id,
            new_email_task,
        )

        return CreateEmailTaskForTestResult(new_email_task=new_email_task)
