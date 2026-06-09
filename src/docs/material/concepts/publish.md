# Publish

Publish lets you share a **read-only** view of selected workspace entities with
people who do not have a Thrive account. You stay in control: sharing is
opt-in, you can prepare a link before it goes live, and you can turn it off
again without deleting the underlying entity.

This is different from [schedule exports](calendar.md#schedule-exports), which
expose calendar streams as an iCal feed for other calendar apps. Publish is
about sharing Thrive entities themselves—habits, docs, persons, and so
on—as a web page anyone with the link can open.

## What You Can Publish

Many entity types support publish. The common ones include:

* [Todos](todos.md)
* [Time plans](time-plans.md)
* Calendar [schedule streams](calendar.md) and their events
* [Habits](habits.md) and [chores](chores.md)
* [Big plans](big-plans.md)
* Docs and doc folders
* [Journals](journals.md)
* [Vacations](vacations.md)
* [Smart lists](smart-lists.md) and smart list items
* [Metrics](metrics.md) and metric entries
* [Persons](prm/persons.md) in the PRM

Not every surface in the workspace is publishable. If an entity supports
publish, the web app exposes controls for it (see below).

## Draft And Active

Each published entity has a **status**:

* **Draft** — you have created a share link, but guests cannot open it yet.
  Useful while you check what will be visible.
* **Active** — the public link works. Anyone with the URL sees a read-only
  view.

Moving back to **draft** immediately revokes guest access. The link stays the
same if you activate again later.

## Where To Manage Publish

How you open the publish controls depends on what you are sharing:

* **Most entities** (habits, chores, persons, individual docs, big plans,
  etc.) — open the entity in the web app and use the **globe** button in the
  leaf panel toolbar. That switches the panel to the publish section.
* **Smart lists** — use the globe button on the smart list branch view (the
  list of items).
* **Doc folders** — open the folder in Docs. A **Publish** section appears at
  the top of the folder listing.
* **All publish records** — open **Core → Publish** in the left sidebar. This
  lists every publish entity in the workspace and lets you open one to see its
  status and public URL.

## The Public Link

When a publish record exists, Thrive shows a **public URL**. That URL always
starts with your site’s public published path and a unique id. You can **copy**
it or **view** it in a new tab (when the publish is active).

Guests do not sign in. They only see what you published, in read-only form.
They cannot browse the rest of your workspace.

If a link stops working, it usually means the publish was moved back to draft,
the entity was removed, or the URL is wrong. Guests see a simple “not found”
page rather than any private data.

## What Guests See For Composite Content

Some published items include related content automatically. You do not need
separate publish records for every child item.

* **Doc folder** — publishing a folder also shares its subfolders and docs.
  Guests can browse the tree and open individual docs inside it.
* **Schedule stream** — guests can open the stream’s calendar and drill into
  in-day and full-day events that belong to that stream.
* **Smart list** — guests can open items that belong to the published list.
* **Metric** — guests can open entries that belong to the published metric.

Publishing a parent does not create extra publish entries for children; access
is implied by the tree you chose to share.

## Security And Privacy

Treat the public URL like an unlisted link: anyone who has it can view the
active publish. There is no separate password on the link.

Only share entities you are comfortable showing read-only to others. Do not
put secrets in notes or fields on entities you plan to publish.

For a step-by-step walkthrough in the web app, see [Share an
Entity](../how-tos/share-an-entity.md).
