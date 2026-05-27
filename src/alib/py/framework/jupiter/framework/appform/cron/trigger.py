"""Cron schedule helpers shared by WebAPI and standalone cron runners."""

from apscheduler.triggers.cron import CronTrigger


def cron_trigger_from_crontab(crontab: str) -> CronTrigger:
    """Build an APScheduler cron trigger from a 5- or 6-field crontab string."""
    parts = crontab.split()
    if len(parts) == 6:
        second, minute, hour, day, month, day_of_week = parts
        return CronTrigger(
            second=second,
            minute=minute,
            hour=hour,
            day=day,
            month=month,
            day_of_week=day_of_week,
        )
    if len(parts) == 5:
        return CronTrigger.from_crontab(crontab)
    raise Exception(
        "Invalid background mutation crontab "
        f"(expected 5 or 6 whitespace-separated fields): {crontab!r}"
    )
