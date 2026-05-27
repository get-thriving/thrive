"""Remove links related to circles."""

from jupiter.core.prm.sub.circle.root import Circle
from jupiter.core.prm.sub.person_circle_links.root import PersonCircleLink
from jupiter.framework.context import DomainContext
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork


class CircleRemoveService:
    """Service for removing a circle's associated links."""

    async def remove_links(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        circle: Circle,
    ) -> None:
        """Remove all person-circle links for the given circle."""
        all_links = await uow.get_for_record(PersonCircleLink).find_all(
            circle.prm.ref_id
        )
        for link in all_links:
            if link.circle_ref_id != circle.ref_id:
                continue
            await uow.get_for_record(PersonCircleLink).remove(
                (circle.prm.ref_id, link.person_ref_id, circle.ref_id)
            )
