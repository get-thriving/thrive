from enum import Enum


class PartialDateType(str, Enum):
    ABSOLUTE_YEAR = "absolute-year"
    ABSOLUTE_YEAR_MONTH = "absolute-year-month"
    ABSOLUTE_YEAR_MONTH_DAY = "absolute-year-month-day"
    PRESENT = "present"
    RELATIVE_DECADE = "relative-decade"
    RELATIVE_YEAR = "relative-year"

    def __str__(self) -> str:
        return str(self.value)
