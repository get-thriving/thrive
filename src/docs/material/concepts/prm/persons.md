# Persons

A person has a name, and it must be unique.

A person can also belong to [circles](circles.md). It can belong to 0, 1, 2, or
at most three of them, to signal belonging to friends, family, colleagues, etc.

A person can have a defined _catch up period_. Some guideline for how often you
should try tocatch up with them - a message, a call, or even a dinner would all
count. Correspondinginbox tasks are [generated](../tasks-generation.md) in the PRM
_catch up project_ much likewith [metrics collection](../metrics.md).

* There are a number of other optional parameters which control how the catch up
  inbox task is
  setup, and they have the same meanings as for [habits](../habits.md).
* If the period is missing, then no generation occurs, and the whole parameter
  set is ignored.

A person can have a birthday. It needs to be specified with the format like `12
Apr`. Aninbox task is defined yearly for this and also generated.

* If the birthday is missing, the no generation occurs.
* The birthday has an actionable date so it doesn't clog up the inbox. It
  becomes visible like:
  * `28` days in advance for family
  * `14` days in advance for friends
  * `2` days in advance for everyone else

## Person Settings

In the web app you can change the global catch up project via the `Settings`
button:

![Persons Settings](../../assets/persons-settings.png)
