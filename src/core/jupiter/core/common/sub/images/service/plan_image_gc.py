"""Decide which objects in the image store nobody owns any more."""

from collections.abc import Iterable
from dataclasses import dataclass
from datetime import timedelta
from typing import Final

from jupiter.core.common.sub.images.sub.image.image_path import ImagePath
from jupiter.core.common.sub.images.sub.image.stored_image_info import StoredImageInfo
from jupiter.framework.base.timestamp import Timestamp

# An object is put in the store before the row that names it is committed, so a
# young one without a row may just be on its way to getting one.
MIN_ORPHAN_AGE: Final[timedelta] = timedelta(days=1)

# How many a single run removes. More than this is more likely a bug than a day's
# worth of crashes, and the rest goes the next day.
MAX_REMOVED_PER_RUN: Final[int] = 200

# Below this many objects, having none of them known is just a small install.
_SMALL_STORE: Final[int] = 10


class ImageGcRefusedError(Exception):
    """The store and the database disagree too much to trust either."""


@dataclass(frozen=True)
class ImageGcPlan:
    """What a run of the image garbage collection is going to do."""

    to_remove: list[ImagePath]
    left_for_next_run: int
    young_orphans: int
    rows_without_object: int


class PlanImageGcService:
    """Decide which objects in the image store nobody owns any more."""

    def do_it(
        self,
        stored: Iterable[StoredImageInfo],
        known_paths: Iterable[ImagePath],
        now: Timestamp,
    ) -> ImageGcPlan:
        """Decide which objects to remove.

        Refuses outright, rather than remove anything, when the database holds no
        image at all while the store holds many, or when most of a sizeable store
        looks orphaned: that is a database that was restored or pointed at wrongly,
        and deleting then would take everyone's pictures.
        """
        stored_list = list(stored)
        known = set(known_paths)
        stored_paths = {info.path for info in stored_list}

        orphans = [info for info in stored_list if info.path not in known]

        if len(stored_list) > _SMALL_STORE:
            if not known:
                raise ImageGcRefusedError(
                    f"The database has no images but the store has {len(stored_list)}"
                )
            if len(orphans) * 2 > len(stored_list):
                raise ImageGcRefusedError(
                    f"{len(orphans)} of {len(stored_list)} stored images have no row"
                )

        old_orphans = sorted(
            (
                info
                for info in orphans
                if now.the_ts - info.created_time.the_ts >= MIN_ORPHAN_AGE
            ),
            key=lambda info: info.created_time.the_ts,
        )
        chosen = old_orphans[:MAX_REMOVED_PER_RUN]

        return ImageGcPlan(
            to_remove=[info.path for info in chosen],
            left_for_next_run=len(old_orphans) - len(chosen),
            young_orphans=len(orphans) - len(old_orphans),
            rows_without_object=len(known - stored_paths),
        )
