# Todos

Todos are user-created tasks for one-off work you want to track intentionally.
They are ideal for medium-horizon planning: concrete work that matters, should
stay visible, and should stay connected to your Life Plan.

Typical examples:

* "Refresh portfolio"
* "Book annual health check"
* "Prepare tax paperwork"

## How Todos Relate To Inbox Tasks

Each todo is backed by a user inbox task. This means todos reuse the same
execution properties as inbox tasks:

* _Status_ tracks the execution state of the task.
* _Actionable date_ controls when the task should start showing up as something
  worth acting on.
* _Due date_ records the intended deadline.
* _Eisenhower_ and _difficulty_ help with prioritization and sorting.
* _Key_ marks especially important work.

The main difference is organizational:

* [Inbox Tasks](core-entities/inbox-tasks.md) are your broad execution queue.
* Todos are a curated list of intentional personal tasks.

When needed, you can open the todo directly from related inbox task UI.

## Properties

Every todo has:

* a _name_ (the concrete result you want),
* Life Plan links:
  * an _aspect_ (required),
  * optionally a _chapter_,
  * optionally a _goal_,
* optional notes for context/checklists/links.

Because a todo is backed by an inbox task, it also has status, dates, Eisen,
difficulty, and key.

## Todo Views

The Todos page supports multiple views so you can choose planning style:

* _SwiftView_ (default): groups todos by due horizon (today, this week, this
  month, later).
* _Kanban_: grouped by status.
* _Kanban by Eisen_: grouped by Eisenhower quadrant.
* _List_: compact linear view.

These views are available on desktop and mobile, with mobile-optimized
presentations where needed.

## Lifecycle

Todos follow standard task lifecycle rules:

* Active todos can be edited and re-prioritized.
* Archiving/removal should happen through the todo itself when it is linked.
* Related user inbox tasks are kept in sync with the owning todo.

## When To Use Todos

Use todos when you want a deliberate, structured list of meaningful one-off
work. They fit well between long-term planning and immediate execution:

* use [Projects](projects.md) for multi-step efforts that unfold over weeks or
  months,
* use [Inbox Tasks](core-entities/inbox-tasks.md) for day-to-day execution,
* use todos for the important standalone tasks you want to keep organized and
  connected to the bigger picture.
