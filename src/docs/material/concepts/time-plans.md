# Time Plans

Time plans are plans that you make for a particular time period. It isa
committment you make that in a certain period of time, you're going toaccomplish
certain things. This is either making progress or finishingaltogether some
[inbox tasks](./core-entities/inbox-tasks.md) or [projects](./projects.md).

While inbox tasks and projects as they are capture the totality of the workthat
you know of, and even assign due dates or active dates to them, time plansmake
an explicit attempt at placing all this work in time, and committing toit.

The association between an inbox task or project and a time plan, is calledan
_activity_. A time plan can be said to be the collection of its activities.

Time plans are also closely linked with [journals](./journals.md).
Whereasjournals are backward looking, time plans are forward looking.

![Journals](../assets/time-plans-overview.png)

## Auto-Generation

Time plans can be configured to be generated automatically, via the[task gen
mechanism](tasks-generation.md). The mechanism is simple: a fewdays in advance
of the time period a plan would target, a new plan isgenerated, with an optional
planning inbox task attached to it.

There are a number of settings you can control:

* The periods you are using for planning. A typical scenario would be
  yearly and weekly plans.
* Whether to generate time plans and planning tasks, just time plans, or
  nothing at all.
* The eisenhower, difficulty, and [aspect](life-plan/aspects.md) to use for generating
  tasks.
* How many days in advance to generate for each period.

Note that time plans are always for a given period, even if you generatethem in
advance. The tasks associated with them have a due date set to thestart of the
planning period, as you should finish your plans before theperiod.

Also note that if there's a time plan you created targeting that sameperiod and
date combination, a new one _won't_ be generated.

## Properties

Time plans are written on a particular _day_ for a particular _period
interval_.The period can be one of:

* _Daily_: the day's plan
* _Weekly_: the week's plan, as recorded on the particular _day_.
* _Monthly_: the month's plan, as recorded on the particular _day_.
* _Quarterly_: the quarter's plan, as recorded on the particular _day_.
* _Yearly_: a whole year's plan, as recorded on the particular _day_.

Only one journal can exist for a particular day and period combination.

Time plans also have a written document attached to them, so you can addthoughts
that don't fit as neatly into the activities format.

An activity has a _target_, which is either an inbox task or a project.

Activities also have a _kind_, which can be:

* _Finish_: you plan on finishing this activity during the period.
* _Make Progress_: you plan on making progress during the period.

Activities also have a _feasability_, which can be:

* _Must Do_: it is very important that you make the required progress on the
  activity during the period.
* _Nice To Have_: if you can make progress, it's good, if not, no worries.
* _Stretch_: very unlikely to make progress.

Finally activities have a measure of _doneness_ withing the time plan.This is
not something that can be judged at the level of a single activity,but requires
looking at the whole thing.

* Inbox tasks of a _finish kind_ are considered done if they are in either the
  _done_ or _not done_ status, and this occurred during the time plan's period.
* Inbox tasks of a _make progress kind_ are considered done if there is some
  modification of the inbox tasks during the time plan's period.
* Projects of a _finish kind_ are considered done if they are in either the
  _done_ or _not done_ status, and this ocurred during the time plan's period.
* Projects of a _make progress kind_ are considered done if all the inbox tasks
  associated with it in the time plan are considered done, or if there are no
  such tasks if there is some modification done during the time plan's period.

## Standard Questions

Planning goes easier when you don't have to invent the prompts every time. You
can set up a list of _standard questions_ - "What must get done this week?",
"What could get in the way?", and so on - and Thrive will use them to lay out
the document of each new time plan.

Questions live in the "questions" view of the time plans app. Each one has:

* A _name_, which is the question itself, as it'll show up in the plan.
* A _period_, which decides which plans it applies to. A weekly question appears
  in weekly plans only.

Questions are grouped by period, and within a period they have an order you
control with the up and down arrows next to each one. That's the order they
appear in the plan.

The name of a question can be changed at any time. The period can't - make a
question for the other period instead.

### How Questions Reach A Time Plan

When a time plan is created, the questions for its period are used to build the
plan's [note](core-entities/notes.md) - the written document attached to it, not
its activities. Each question becomes a heading, with an empty paragraph under
it for you to write in.

When you create a time plan yourself, the new time plan form lists the questions
for the period you picked, with all of them selected. Unselect the ones you
don't need this time around, or unselect all of them to start from an empty
document. Switching the period swaps the list for that period's questions.

Time plans created by the [task gen mechanism](tasks-generation.md) get all the
questions of their period.

The questions are copied into the plan's document at the moment the plan is
created. Editing, reordering, archiving, or removing a question afterwards
leaves the plans you already have alone - it only affects the ones created from
that point on.

Archiving a question keeps it around, but drops it from the ordering and from
new plans. Removing it gets rid of it for good. The general rules are in
[archival and removal](archival-and-removal.md).
