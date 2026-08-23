# Journals

A journal is a brief recounting of how a particular day, week, month, or other
time period went.Journals live in the "journals" view.

![Journals](../assets/journals-overview.png)

## Auto-Generation

Journals can be configured to be generated automatically, via the[task gen
mechanism](tasks-generation.md). The mechanism is simple: a fewdays in advance
of the time period a journal would target, a new journal isgenerated, with an
optional journaling inbox task attached to it.

There are a number of settings you can control:

* The periods you are using for journaling. A typical scenario would be
  daily and weekly journals.
* Whether to generate journals and journaling tasks, just journals, or
  nothing at all.
* The eisenhower, difficulty, and [aspect](life-plan/aspects.md) to use for generating
  tasks.

Note that journals are always for a given period. The tasks associated withthem
have a due date set to the end of the planning period, as you shouldfinish your
journaling before the period end.

Also note that if there's a journal you created targeting that sameperiod and
date combination, a new one _won't_ be generated.

## Properties

Journals are written on a particular _day_ for a particular _period interval_.
The period can be one of:

* _Daily_: the day's journal
* _Weekly_: the week's journal, as recorded on the particular _day_.
* _Monthly_: the month's journal, as recorded on the particular _day_.
* _Quarterly_: the quarter's journal, as recorded on the particular _day_.
* _Yearly_: a whole year's journal, as recorded on the particular _day_.

Only one journal can exist for a particular _day_. Furthermore, asingle journal
can exist for a particular _period_ in time (so youbetter write the journal of
that period towards the end of it).

Journals are mainly a written artifact, so they're essentially one big
document.But they do have a recording ot the work activitythat happened during
that period (scores achieved, tasks done, etc),much like in the [report
functionality](reporting.md).

## Standard Questions

Journaling goes easier when you don't have to invent the prompts every time. You
can set up a list of _standard questions_ - "What went well this week?", "What
did I learn?", and so on - and Thrive will use them to lay out the document of
each new journal.

Questions live in the "questions" view of the journals app. Each one has:

* A _name_, which is the question itself, as it'll show up in the journal.
* A _period_, which decides which journals it applies to. A weekly question
  appears in weekly journals only.

Questions are grouped by period, and within a period they have an order you
control with the up and down arrows next to each one. That's the order they
appear in the journal.

The name of a question can be changed at any time. The period can't - make a
question for the other period instead.

### How Questions Reach A Journal

When a journal is created, the questions for its period are used to build the
journal's [note](core-entities/notes.md). Each question becomes a heading, with
an empty paragraph under it for you to write in.

When you create a journal yourself, the new journal form lists the questions for
the period you picked, with all of them selected. Unselect the ones you don't
need this time around, or unselect all of them to start from an empty document.
Switching the period swaps the list for that period's questions.

Journals created by the [task gen mechanism](tasks-generation.md) get all the
questions of their period.

The questions are copied into the journal's document at the moment the journal
is created. Editing, reordering, archiving, or removing a question afterwards
leaves the journals you already have alone - it only affects the ones created
from that point on.

Archiving a question keeps it around, but drops it from the ordering and from
new journals. Removing it gets rid of it for good. The general rules are in
[archival and removal](archival-and-removal.md).
