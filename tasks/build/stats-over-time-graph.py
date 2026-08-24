#!/usr/bin/env python3
"""Plot lines of code over time from a stats-over-time CSV."""

from __future__ import annotations

import csv
import sys
from datetime import date
from pathlib import Path

import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit(f"Usage: {sys.argv[0]} <stats-over-time.csv>")

    csv_path = Path(sys.argv[1])
    dates: list[date] = []
    locs: list[int] = []
    with csv_path.open(newline="", encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            dates.append(date.fromisoformat(row["date"]))
            locs.append(int(row["total_lines_of_code"]))

    if len(dates) < 2:
        print("Not enough data to plot.")
        return

    paired = sorted(zip(dates, locs, strict=True))
    dates = [item[0] for item in paired]
    locs = [item[1] for item in paired]

    fig, ax = plt.subplots(figsize=(10, 5))
    ax.plot(dates, locs, marker="o", linewidth=2)
    ax.set_title("Lines of code over time")
    ax.set_xlabel("Date")
    ax.set_ylabel("Lines of code")
    ax.yaxis.set_major_formatter(FuncFormatter(lambda value, _: f"{int(value):,}"))
    ax.grid(True, alpha=0.3)
    fig.autofmt_xdate()
    fig.tight_layout()

    png_path = csv_path.with_suffix(".png")
    fig.savefig(png_path, dpi=150)
    print(f"Wrote {png_path}")

    if sys.stdout.isatty():
        plt.show()
    else:
        plt.close(fig)


if __name__ == "__main__":
    main()
