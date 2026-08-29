# Collaboration

Collaboration lets you share selected workspace entities with **other Thrive
users**. Recipients sign in with their own accounts, see the shared item in
their workspace views, and can work with it according to the access level you
grant.

This is different from [Publish](publish.md), which creates a public read-only
web link for people who do not have a Thrive account. Use collaboration when
you want authenticated access between Thrive users; use publish when you want
an unlisted guest link.

## What You Can Share

Many entity types support collaboration. The common ones include:

* [Todos](todos.md)
* [Time plans](time-plans.md)
* Calendar [schedule streams](calendar.md) and their events
* [Habits](habits.md) and [chores](chores.md)
* [Projects](projects.md)
* Docs and doc folders
* [Journals](journals.md)
* [Vacations](vacations.md)
* [Smart lists](smart-lists.md) and smart list items
* [Metrics](metrics.md) and metric entries
* [Persons](prm/persons.md) in the PRM

If an entity supports collaboration, the web app shows an **Access** section on
its leaf panel. Not every surface in the workspace is shareable yet.

## Access Levels

Each collaborator has an **access level** on the shared entity:

* **Reader** — can view the entity.
* **Commenter** — between reader and writer; useful when you want more than
  view-only access without full edit rights.
* **Writer** — can view and change the entity (updates, archival where the
  product allows writers, and similar mutations).
* **Owner** — the person who created (or otherwise owns) the entity. Ownership
  is not transferred by inviting someone else. Only the owner can invite
  others, change grants, or remove collaborators.

When you invite someone or they ask for access, you choose reader, commenter,
or writer—not owner.

## How Sharing Works

### Invites

As the **owner**, open the entity and use the **Access** section:

1. Search for the Thrive user you want to invite.
2. Choose an access level.
3. Send the invite.

Thrive creates a grant immediately and records an **invite** for the
recipient. They see it under **Core → Collaboration → Invites** (and on the
optional Collaboration home widget). They can **acknowledge** the invite to
clear it from the pending list, or the owner can **cancel** it.

Acknowledging an invite does not create access—that already exists from the
grant. It simply marks that the recipient has seen the invitation.

### Access Requests

If someone opens a link to an entity they cannot access, Thrive shows an
**Access Denied** screen. For shareable entities they can **ask for read
access** or **ask for write access**.

That creates a pending **request** for the owner. The owner reviews it under
**Core → Collaboration → Asked of you** and can **accept** or **reject**. The
requester tracks status under **Asking**.

### Changing Or Ending Access

* **Owner** — in the entity’s Access section, change a collaborator’s level or
  remove their grant.
* **Collaborator** — use **Forget** on the shared entity (or from the grant
  detail under Collaboration) to drop their own access. Forget applies to the
  entity that holds the grant, not to children that only inherited access.

## Inherited Access

Sharing some parents also covers related children without a separate invite for
each child. Typical cases:

* **Doc folder** — access to the folder cascades through subfolders and docs.
* **Smart list** — items under the list inherit access.
* **Metric** — entries under the metric inherit access.
* **Time plan** — activities under the plan can inherit access.

Inherited access shows up in the Access UI so you can tell a direct grant from
rights that come from a parent. Manage invites and removals on the parent (or
the entity that owns the grant), not on every inherited child.

## Collaboration Hub

Open **Core → Collaboration** in the left sidebar for a workspace-wide view:

| Tab | What it shows |
| --- | --- |
| **Invites** | Pending invitations you received |
| **Asked of you** | Access requests on entities you own |
| **Asking** | Access requests you sent |
| **Shared with you** | Entities others have granted you |
| **Shared by you** | Entities you have shared with others |

You can filter by person. Opening an entry shows details and actions (acknowledge,
accept/reject, forget, and so on).

You can also add a **Collaboration** widget on the [home page](home-page.md) for
a quick glance at pending invites and requests.

## How Shared Entities Appear

Shared entities show up in the usual lists and views for the people who have
access—not only for the owner. Trunk and leaf views show an **owner** chip so
you can tell when an item belongs to someone else.

Your own [workspace](workspaces.md) remains yours: collaboration does not merge
workspaces. It grants access to specific entities across accounts.

## Collaboration Vs Publish

| | Collaboration | Publish |
| --- | --- | --- |
| Audience | Other Thrive accounts | Anyone with the link (no account) |
| Access | Reader / commenter / writer | Read-only guest page |
| Control | Invites, requests, grants, forget | Draft / active public URL |
| Where | Access panel + Core → Collaboration | Globe / Publish panel + Core → Publish |

You can use both on the same entity when that makes sense—for example, invite a
partner as a writer while also publishing a read-only page for a wider group.

## Security And Privacy

Only invite people you trust with the level you grant. Writers can change the
shared entity; readers can see its contents, including notes and related fields.

Treat entity links as private. Someone without a grant who opens a link will
hit Access Denied and may request access—they do not see the private contents.

For a step-by-step walkthrough, see [Collaborate on an
Entity](../how-tos/collaborate-on-an-entity.md). For public guest links, see
[Share an Entity](../how-tos/share-an-entity.md) and [Publish](publish.md).
