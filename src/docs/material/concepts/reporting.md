# Reporting

Reporting is currently the main tool for reflection on past achievements, good
aspects, and weak spots.

In the web app you can find reporting in the `Reports` left-hand side tab, under
_tools_. It lookssomething like this:

![The report tool: choose the date, the period and the breakdown period, then run it](../assets/report-form.png "The report tool: choose the date, the period and the breakdown period, then run it")

You can select a time at which to run the report. By default it is the present
day, but you can selectany day in the past (or the future).

You can also ask a time period to analyse - the last week, month, quarter, or
year.

Finally you can ask for a time period to use for a breakdown analysis. This is
always some time unitsmaller than the analysis period. Within the analysis
period, each breakdown period will be analysedin part.

The main result is called `Global` and shows you aggregate stats for the whole
analysis period. It isthe most valuable view. It looks something like this:

![A monthly report: scores by period and the inbox tasks created, done and not done](../assets/report-global.png "A monthly report: scores by period and the inbox tasks created, done and not done")

A very useful view is the breakdown by habit, that shows streaks for each habit.
It looks somethinglike this:

![The inbox task breakdown of a report, by kind of task and by status](../assets/report-streaks.png "The inbox task breakdown of a report, by kind of task and by status")

But there are other views:

* A breakdown by aspect which can highlight particularly good or bad aspects.
* A breakdown by sub period
* A breakdown by big plans
* An analysis for chores, but without any streaks.

The CLI command is called `report` and has the same capabilities as the Web App.
