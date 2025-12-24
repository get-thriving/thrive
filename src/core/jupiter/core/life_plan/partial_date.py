"""A date in the life plan."""

from jupiter.framework.base.adate import ADate
from jupiter.framework.errors import InputValidationError
from jupiter.framework.realm.realm import (
    DatabaseRealm,
    RealmDecoder,
    RealmDecodingError,
    RealmEncoder,
    RealmThing,
)
from jupiter.framework.value import AtomicValue, EnumValue, enum_value, value


@enum_value
class PartialDateType(EnumValue):
    """The type of a partial date."""

    ABSOLUTE_YMD = "absolute-year-month-day"
    ABSOLUTE_YM = "absolute-year-month"
    ABSOLUTE_Y = "absolute-year"
    RELATIVE_YEAR = "relative-year"
    RELATIVE_DECADE = "relative-decade"


@value
class PartialDate(AtomicValue[str]):
    """A date in the life plan."""

    type: PartialDateType
    year: int
    month: int | None
    day: int | None

    @staticmethod
    def from_absolute_ymd(year: int, month: int, day: int) -> "PartialDate":
        """Construct a partial date from its components."""
        if year < 1900 or year > 2100:
            raise InputValidationError(
                f"Expected year to be a valid year between 1900 and 2100 but was {year}"
            )
        if month < 1 or month > 12:
            raise InputValidationError(
                f"Expected month to be a valid month but was {month}"
            )
        if day < 1 or day > 31:
            raise InputValidationError(f"Expected day to be a valid day but was {day}")
        return PartialDate(
            type=PartialDateType.ABSOLUTE_YMD, year=year, month=month, day=day
        )

    @staticmethod
    def from_absolute_ym(year: int, month: int) -> "PartialDate":
        """Construct a partial date from its components."""
        if year < 1900 or year > 2100:
            raise InputValidationError(
                f"Expected year to be a valid year between 1900 and 2100 but was {year}"
            )
        if month < 1 or month > 12:
            raise InputValidationError(
                f"Expected month to be a valid month but was {month}"
            )
        return PartialDate(
            type=PartialDateType.ABSOLUTE_YM, year=year, month=month, day=None
        )

    @staticmethod
    def from_absolute_y(year: int) -> "PartialDate":
        """Construct a partial date from its components."""
        if year < 1900 or year > 2100:
            raise InputValidationError(
                f"Expected year to be a valid year between 1900 and 2100 but was {year}"
            )
        return PartialDate(
            type=PartialDateType.ABSOLUTE_Y, year=year, month=None, day=None
        )

    @staticmethod
    def from_relative_year(year: int) -> "PartialDate":
        """Construct a partial date from its components."""
        if year < 1 or year > 100:
            raise InputValidationError(
                f"Expected year to be a valid year between 1 and 10 but was {year}"
            )
        return PartialDate(
            type=PartialDateType.RELATIVE_YEAR, year=year, month=None, day=None
        )

    @staticmethod
    def from_relative_decade(year: int) -> "PartialDate":
        """Construct a partial date from its components."""
        if year < 1 or year > 100:
            raise InputValidationError(
                f"Expected year to be a valid year between 1 and 100 but was {year}"
            )
        if year % 10 != 0:
            raise InputValidationError(
                f"Expected year to be a multiple of 10 but was {year}"
            )
        return PartialDate(
            type=PartialDateType.RELATIVE_DECADE, year=year, month=None, day=None
        )

    def earliest_relative_to(self, birthday: ADate) -> ADate:
        """Get the earliest relative date to the birthday."""
        match self.type:
            case PartialDateType.ABSOLUTE_YMD:
                return ADate.from_components(self.year, self.month or 1, self.day or 1)
            case PartialDateType.ABSOLUTE_YM:
                return ADate.from_components(self.year, self.month or 1, 1)
            case PartialDateType.ABSOLUTE_Y:
                return ADate.from_components(self.year, 1, 1)
            case PartialDateType.RELATIVE_YEAR:
                return birthday.add_years(self.year)
            case PartialDateType.RELATIVE_DECADE:
                return birthday.add_years(self.year)

    def latest_relative_to(self, birthday: ADate) -> ADate:
        """Get the latest relative date to the birthday."""
        match self.type:
            case PartialDateType.ABSOLUTE_YMD:
                return ADate.from_components(self.year, self.month or 1, self.day or 1)
            case PartialDateType.ABSOLUTE_YM:
                return ADate.from_components(self.year, self.month or 1, 1).end_of(
                    "month"
                )
            case PartialDateType.ABSOLUTE_Y:
                return ADate.from_components(self.year, 1, 1).end_of("year")
            case PartialDateType.RELATIVE_YEAR:
                return birthday.add_years(self.year).end_of("year")
            case PartialDateType.RELATIVE_DECADE:
                return birthday.add_years(self.year + 9).end_of("year")


class PartialDateDatabaseEncoder(RealmEncoder[PartialDate, DatabaseRealm]):
    """An encoder for partial dates in databases."""

    def encode(self, value: PartialDate) -> RealmThing:
        """Encode a partial date to a database realm."""
        res = f"{value.type.value} {value.year}"

        if value.month is not None:
            res += f" {value.month}"

        if value.day is not None:
            res += f" {value.day}"

        return res


class PartialDateDatabaseDecoder(RealmDecoder[PartialDate, DatabaseRealm]):
    """A decoder for partial dates in databases."""

    def decode(self, value: RealmThing) -> PartialDate:
        """Decode a partial date from a database realm."""
        if not isinstance(value, str):
            raise RealmDecodingError(
                f"Invalid partial date: {value}"
            )

        parts = value.split(" ")

        try:
            match parts[0]:
                case "absolute-year-month-day":
                    return PartialDate.from_absolute_ymd(
                        year=int(parts[1]),
                        month=int(parts[2]),
                        day=int(parts[3]),
                    )
                case "absolute-year-month":
                    return PartialDate.from_absolute_ym(
                        year=int(parts[1]),
                        month=int(parts[2]),
                    )
                case "absolute-year":
                    return PartialDate.from_absolute_y(year=int(parts[1]))
                case "relative-year":
                    return PartialDate.from_relative_year(year=int(parts[1]))
                case "relative-decade":
                    return PartialDate.from_relative_decade(year=int(parts[1]))
                case _:
                    raise RealmDecodingError(
                        f"Invalid partial date type: {value}"
                    )
        except ValueError as err:
            raise RealmDecodingError(
                f"Invalid partial date: {value}"
            ) from err
