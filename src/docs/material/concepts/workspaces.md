# Workspace

All the work for life planning takes place in a _workspace_. When you create a
newaccount in the web app or call `thrive init` in the CLI app you are creatinga
new workspace.

Right now, a single account can have just one workspace, that is private to the
user.

All further concepts we discuss are _relative_ to the workspace.

After creating a workspace, you’ll see something like the following, depending
on the feature flags selected:

![Workspace](../assets/workspaces.png)

## Properties

A workspace has a _name_.

A workspace also has a notion of _default aspect_. Checkout [the aspects
section](life-plan/aspects.md) for more details about aspects. But in context
where a aspect is needed - say when adding a new inbox task, or generating
an inbox task from a metric - and none is specified, this one will be used
instead.

[Feature flags](feature-flags.md) are also associated with a workspace.
