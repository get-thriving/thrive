# Events

Events are the core entities used to represent things in time.

In Thrive, events are managed in the [Calendar](../calendar.md) and are useful
both for planning (future) and recording (past).

## What An Event Contains

At a minimum, an event has:

* a name,
* a time range,
* a stream it belongs to.

An event can be one of:

* _Full day_: starts on a day and spans one or more full days.
* _In day_: starts at a specific date and time, with a bounded duration.

## Event Sources

Events can be created directly by users, or generated from other concepts.

Common generated sources include:

* [Inbox Tasks](inbox-tasks.md),
* [Persons / Birthdays](../prm/persons.md),
* [Vacations](../vacations.md).

## Streams

Events live inside calendar streams. A stream is a container used to group
events. Streams can be user-managed or imported from external iCal feeds.

For stream-level details and schedule exports, see [Calendar](../calendar.md).