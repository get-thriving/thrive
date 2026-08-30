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

## Buffers

An in-day event can also carry a _buffer before_ and a _buffer after_, each a
number of minutes. These are optional, and they hold the logistics around the
event -- travelling to it, or winding down from it -- so that time reads as
taken up without becoming part of the event itself.

Buffers show up in the calendar as hatched bands hugging the event, and can be
set wherever an in-day event is created or edited. Leaving a buffer field empty
means the event has no buffer on that side.

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
