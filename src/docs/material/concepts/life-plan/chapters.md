# Chapters

A _Chapter_ represents a meaningful phase of your life — a period with a
clear beginning and end that is associated with a particular [project](projects.md).
Chapters are part of the [Life Plan](overview.md).

## Purpose

Life is not uniform. There are periods of study, of career building, of
raising children, of retirement, of adventure. Chapters let you carve your
life into these distinct phases and reflect on them in a structured way.

A chapter might be something like:
- _"University years"_ — from age 18 to age 22.
- _"Early career at Acme Corp"_ — from 2020 to 2026.
- _"Living in Berlin"_ — from a specific date to a milestone (e.g. "Move back
  home").
- _"Kids at home"_ — from your first child's birth to their leaving for
  university.

## Properties

| Property | Description |
| -------- | ----------- |
| **Name** | A short, descriptive label for this chapter. |
| **Project** | The [project](projects.md) this chapter is associated with. |
| **Start Date** | A [partial date](#partial-dates) indicating when the chapter begins. |
| **End Date** | A [partial date](#partial-dates) indicating when the chapter ends. |

Chapters also support a **note** for additional free-form context and **tags**
for organisation.

## Partial Dates

Chapter start and end dates are _partial dates_ — flexible expressions that
don't have to be fully specified calendar dates. The supported forms are:

| Form | Example | Description |
| ---- | ------- | ----------- |
| Absolute (year, month, day) | `2024-03-15` | A specific date. |
| Absolute (year, month) | `2024-03` | Anywhere in a specific month. |
| Absolute (year) | `2024` | Anywhere in a specific year. |
| Relative year | Age 30 | The year you turn a given age. |
| Relative decade | Age 30s | The decade starting at a given age. |
| Milestone | "Move to London" | Anchored to a named [milestone](milestones.md). |
| Present | Now | The current date. |
| Start | Birth | Your date of birth. |
| End | End of life | The end of your configured maximum age. |

This flexibility means you can define chapters at whatever level of precision
makes sense — from a known calendar date to a loose phase like _"your 30s"_.

## Validation

The start date must resolve to a date that is strictly before the end date.
If you reference a milestone in either date, that milestone must exist.

## Accessing Chapters

Open the **Life Plan** section from the sidebar, then choose **Chapters**
from the menu.
