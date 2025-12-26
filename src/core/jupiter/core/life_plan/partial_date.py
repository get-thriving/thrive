"""A date in the life plan."""

from typing import Final

from jupiter.core.life_plan.sub.milestones.root import Milestone
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.realm.realm import (
    DatabaseRealm,
    RealmDecoder,
    RealmDecodingError,
    RealmEncoder,
    RealmThing,
)
from jupiter.framework.value import AtomicValue, EnumValue, enum_value, value

MIN_YEAR: Final[int] = 1900
MAX_YEAR: Final[int] = 2100
MIN_AGE: Final[int] = 0
MAX_AGE: Final[int] = 100


@enum_value
class PartialDateType(EnumValue):
    """The type of a partial date."""

    ABSOLUTE_YMD = "absolute-year-month-day"
    ABSOLUTE_YM = "absolute-year-month"
    ABSOLUTE_Y = "absolute-year"
    RELATIVE_YEAR = "relative-year"
    RELATIVE_DECADE = "relative-decade"
    MILESTONE = "milestone"
    PERSENT = "present"


@value
class PartialDate(AtomicValue[str]):
    """A date in the life plan."""

    type: PartialDateType
    year: int | None
    month: int | None
    day: int | None
    milestone_ref_id: EntityId | None

    @staticmethod
    def from_absolute_ymd(year: int, month: int, day: int) -> "PartialDate":
        """Construct a partial date from its components."""
        if year < MIN_YEAR or year > MAX_YEAR:
            raise InputValidationError(
                f"Expected year to be a valid year between {MIN_YEAR} and {MAX_YEAR} but was {year}"
            )
        if month < 1 or month > 12:
            raise InputValidationError(
                f"Expected month to be a valid month but was {month}"
            )
        if day < 1 or day > 31:
            raise InputValidationError(f"Expected day to be a valid day but was {day}")
        return PartialDate(
            type=PartialDateType.ABSOLUTE_YMD,
            year=year,
            month=month,
            day=day,
            milestone_ref_id=None,
        )

    @staticmethod
    def from_absolute_ym(year: int, month: int) -> "PartialDate":
        """Construct a partial date from its components."""
        if year < MIN_YEAR or year > MAX_YEAR:
            raise InputValidationError(
                f"Expected year to be a valid year between {MIN_YEAR} and {MAX_YEAR} but was {year}"
            )
        if month < 1 or month > 12:
            raise InputValidationError(
                f"Expected month to be a valid month but was {month}"
            )
        return PartialDate(
            type=PartialDateType.ABSOLUTE_YM,
            year=year,
            month=month,
            day=None,
            milestone_ref_id=None,
        )

    @staticmethod
    def from_absolute_y(year: int) -> "PartialDate":
        """Construct a partial date from its components."""
        if year < MIN_YEAR or year > MAX_YEAR:
            raise InputValidationError(
                f"Expected year to be a valid year between {MIN_YEAR} and {MAX_YEAR} but was {year}"
            )
        return PartialDate(
            type=PartialDateType.ABSOLUTE_Y,
            year=year,
            month=None,
            day=None,
            milestone_ref_id=None,
        )

    @staticmethod
    def from_relative_year(year: int) -> "PartialDate":
        """Construct a partial date from its components."""
        if year < MIN_AGE or year > MAX_AGE:
            raise InputValidationError(
                f"Expected year to be a valid year between {MIN_AGE} and {MAX_AGE} but was {year}"
            )
        return PartialDate(
            type=PartialDateType.RELATIVE_YEAR,
            year=year,
            month=None,
            day=None,
            milestone_ref_id=None,
        )

    @staticmethod
    def from_relative_decade(year: int) -> "PartialDate":
        """Construct a partial date from its components."""
        if year < MIN_AGE or year > MAX_AGE:
            raise InputValidationError(
                f"Expected decade to be a valid year between {MIN_AGE} and {MAX_AGE} but was {year}"
            )
        if year % 10 != 0:
            raise InputValidationError(
                f"Expected decade to be a multiple of 10 but was {year}"
            )
        return PartialDate(
            type=PartialDateType.RELATIVE_DECADE,
            year=year,
            month=None,
            day=None,
            milestone_ref_id=None,
        )

    @staticmethod
    def from_present() -> "PartialDate":
        """Construct a partial date from the present."""
        return PartialDate(
            type=PartialDateType.PERSENT,
            year=None,
            month=None,
            day=None,
            milestone_ref_id=None,
        )

    @staticmethod
    def from_milestone(milestone_ref_id: EntityId) -> "PartialDate":
        """Construct a partial date from a milestone."""
        return PartialDate(
            type=PartialDateType.MILESTONE,
            year=None,
            month=None,
            day=None,
            milestone_ref_id=milestone_ref_id,
        )

    def earliest_relative_to(
        self, birthday: ADate, today: ADate, milestones: list[Milestone]
    ) -> ADate:
        """Get the earliest relative date to the birthday."""
        match self.type:
            case PartialDateType.ABSOLUTE_YMD:
                return ADate.from_components(
                    self.year or 1990, self.month or 1, self.day or 1
                )
            case PartialDateType.ABSOLUTE_YM:
                return ADate.from_components(self.year or 1990, self.month or 1, 1)
            case PartialDateType.ABSOLUTE_Y:
                return ADate.from_components(self.year or 1990, 1, 1)
            case PartialDateType.RELATIVE_YEAR:
                return birthday.add_years(self.year or 0)
            case PartialDateType.RELATIVE_DECADE:
                return birthday.add_years(self.year or 0)
            case PartialDateType.MILESTONE:
                return next(
                    m for m in milestones if m.ref_id == self.milestone_ref_id
                ).date
            case PartialDateType.PERSENT:
                return today

    def latest_relative_to(
        self, birthday: ADate, today: ADate, milestones: list[Milestone]
    ) -> ADate:
        """Get the latest relative date to the birthday."""
        match self.type:
            case PartialDateType.ABSOLUTE_YMD:
                return ADate.from_components(
                    self.year or 1990, self.month or 1, self.day or 1
                )
            case PartialDateType.ABSOLUTE_YM:
                return ADate.from_components(
                    self.year or 1990, self.month or 1, 1
                ).end_of("month")
            case PartialDateType.ABSOLUTE_Y:
                return ADate.from_components(self.year or 1990, 1, 1).end_of("year")
            case PartialDateType.RELATIVE_YEAR:
                return birthday.add_years(self.year or 0).end_of("year")
            case PartialDateType.RELATIVE_DECADE:
                return birthday.add_years(self.year or 0 + 9).end_of("year")
            case PartialDateType.MILESTONE:
                return next(
                    m for m in milestones if m.ref_id == self.milestone_ref_id
                ).date
            case PartialDateType.PERSENT:
                return today

    def contains_milestone(self, milestone_ref_id: EntityId) -> bool:
        """Check if the partial date contains a milestone."""
        return (
            self.type == PartialDateType.MILESTONE
            and self.milestone_ref_id == milestone_ref_id
        )


class PartialDateDatabaseEncoder(RealmEncoder[PartialDate, DatabaseRealm]):
    """An encoder for partial dates in databases."""

    def encode(self, value: PartialDate) -> RealmThing:
        """Encode a partial date to a database realm."""
        res = f"{value.type.value}"

        if value.year is not None:
            res += f" {value.year}"

        if value.month is not None:
            res += f" {value.month}"

        if value.day is not None:
            res += f" {value.day}"

        if value.milestone_ref_id is not None:
            res += f" {value.milestone_ref_id.as_int()}"

        return res


class PartialDateDatabaseDecoder(RealmDecoder[PartialDate, DatabaseRealm]):
    """A decoder for partial dates in databases."""

    def decode(self, value: RealmThing) -> PartialDate:
        """Decode a partial date from a database realm."""
        if not isinstance(value, str):
            raise RealmDecodingError(f"Invalid partial date: {value}")

        parts = value.split(" ")

        try:
            match parts[0]:
                case PartialDateType.ABSOLUTE_YMD.value:
                    return PartialDate.from_absolute_ymd(
                        year=int(parts[1]),
                        month=int(parts[2]),
                        day=int(parts[3]),
                    )
                case PartialDateType.ABSOLUTE_YM.value:
                    return PartialDate.from_absolute_ym(
                        year=int(parts[1]),
                        month=int(parts[2]),
                    )
                case PartialDateType.ABSOLUTE_Y.value:
                    return PartialDate.from_absolute_y(year=int(parts[1]))
                case PartialDateType.RELATIVE_YEAR.value:
                    return PartialDate.from_relative_year(year=int(parts[1]))
                case PartialDateType.RELATIVE_DECADE.value:
                    return PartialDate.from_relative_decade(year=int(parts[1]))
                case PartialDateType.PERSENT.value:
                    return PartialDate.from_present()
                case PartialDateType.MILESTONE.value:
                    return PartialDate.from_milestone(
                        milestone_ref_id=EntityId(parts[1])
                    )
                case _:
                    raise RealmDecodingError(f"Invalid partial date type: {value}")
        except ValueError as err:
            raise RealmDecodingError(f"Invalid partial date: {value}") from err
