# Search

Thrive has a generic search across entities (inbox tasks, journals, metrics, and
so on): match by name and optional note snippets, with filters for entity type,
archived items, and date ranges.

## WebUI

Use the **search icon** in the workspace header. It opens an overlay where you
can type a query (results load as you go), use the **Tune** control for the same
advanced filters as before, and follow a result to open that entity. There is no
separate Search screen under Tools anymore. The keyboard shortcut is `⌘K`
(`Ctrl+K` on Windows and Linux). See [Keyboard Shortcuts](keyboard-shortcuts.md)
for the other keys.

![The search overlay: type to see matching entities as you go, with filters for tags, contacts and locations](../assets/keyboard-search.png "The search overlay: type to see matching entities as you go, with filters for tags, contacts and locations")

## CLI

A CLI command also exists, invoked via `thrive search`, with equivalent search
and filter behaviour for scripting and terminal use.
