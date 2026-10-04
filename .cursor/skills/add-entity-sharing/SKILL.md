---
name: add-entity-sharing
description: >-
  Add authenticated sharing/access-grant support to a Thrive crown entity
  (load/find owner+access_status, leaf access panel, owner chip, non-owner
  mutations, forget redirect, API/WebUI ACL tests). Use when the user asks to
  add sharing, access grants, invite/forget, or reader/writer support for an
  entity like todos, vacations, habits, docs, or similar.
---

# Add entity sharing support

Mirror the **todo** / **vacation** pattern. Prefer vacations as the simpler
leaf reference; todos for life-plan association quirks.

Canonical references:
- Backend: `src/core/jupiter/core/apps/vacations/sub/vacation/service/load.py`, `sub/vacation/use_case/find.py`, `sub/vacation/use_case/load.py`
- Leaf UI: `src/webui/app/routes/app/workspace/apps/vacations/vacation/$id.tsx`
- Trunk UI: `src/webui/app/routes/app/workspace/apps/vacations.tsx`
- Todo extras: `src/core/jupiter/core/apps/todo/components/properties-editor.tsx`
- Tests: `itests/api/vacations.test.py`, `itests/webui/entities/vacations.test.py`
- Access infra: `src/core/jupiter/core/common/sub/access/`

## Checklist

Copy and track:

```
Sharing Progress:
- [ ] 1. Allowlist + crown ACL bases
- [ ] 2. Load result: owner + access_status
- [ ] 3. Find result: owner + access_status + cross-workspace
- [ ] 4. Mutation use cases (writer for non-owners)
- [ ] 5. Generate clients
- [ ] 6. Leaf panel access wiring
- [ ] 7. Trunk owner chip
- [ ] 8. Entity-specific foreign refs (if any)
- [ ] 9. API + WebUI ACL tests
```

## 1. Allowlist + crown ACL

- Entity type must be in `ALLOWED_SHARED_ACCESS_OWNER_TYPES` in
  `src/core/jupiter/core/common/sub/access/shareable.py`.
- If the entity needs extra access refresh beyond OwnsLink/ContainsLink
  cascade, add a `RefreshAccessForEntityService` and register it in
  `REFRESH_ACCESS_FOR_ENTITY_SERVICES` in that same file.
- Create must grant `OWNER` (via `JupiterCreateCrownEntityUseCase` /
  `create_entity`).
- Load/find/update/archive/remove should already use
  `Jupiter*CrownEntityUseCase` bases (READER for load/find, WRITER for
  mutations). If not, migrate them.

## 2. Load: return owner + access_status

In the entity load **service** result:

```python
owner: UserLight
access_status: AccessStatus | None  # None for public/guest load
```

Resolve with:

- `LoadUserThatOwnsEntityService().do_it(uow, entity_link)`
- `GetAccessLevelForEntityService().do_it(...)` only when `user_ref_id` is set

Pass `user_ref_id=context.user.ref_id` from the authenticated load use case.
Public load must omit `user_ref_id` so `access_status` stays `None`.

## 3. Find: owner + access_status + cross-workspace

In each find result entry:

```python
owner: UserLight
access_status: AccessStatus  # non-optional
```

Required pattern (do **not** constrain to the caller's collection parent):

```python
entities = await self.find_all_entities(
    uow, context.user.ref_id, Entity, allow_archived=..., filter_ref_ids=...
)
```

Then bulk-resolve:

- `OwnerUserRefIdsForEntitiesService` + `UserRepository.find_all_light_by_ref_ids`
- `AccessStatusRepository.load_all_for_entities_and_user`

Use `@use_case_result_part` for the entry type when matching todos/vacations.

## 4. Mutation use cases for non-owners

Shared **writers** must be able to update/archive/remove without owning
linked crown entities they are not retargeting.

- Prefer crown bases: `load_entity` / `check_entity` → WRITER on the entity.
- If update validates related crown entities (aspects, chapters, …), only
  ACL-check them when the ref id **actually changes**. Keeping the owner's
  existing links must succeed for shared writers.
- Tag/contact upsert and publish typically require OWNER — leave as-is;
  disable those UI controls via `accessStatus` when not owner.

## 5. Generate clients

After changing use-case IO:

```bash
mise run generate-client-code
```

Wait for `Client code generation complete` on stderr.

## 6. Leaf panel access wiring

In `$id.tsx` (or equivalent leaf):

1. Loader returns `owner` and `accessStatus` from load result.
2. Gate editing:

```ts
const inputsEnabled =
  navigation.state === "idle" &&
  !entity.archived &&
  accessStatusAllowsWriterOrAbove(loaderData.accessStatus);
```

3. Pass to `LeafPanel` (note spelling `accessable`):

```tsx
accessable
accessOwner={loaderData.owner}
accessStatus={loaderData.accessStatus}
```

4. Pass `accessStatus` through to publish so non-owners cannot publish.
5. `returnLocation` on the panel is used by Forget → redirect to trunk.

Forget flow (shared infra — do not break it):

- `forget-grant` action **redirects** to `returnLocation` after remove.
- Do **not** skip revalidation for forget-grant: trunk must reload so the
  entity disappears from the list; redirect avoids reloading the leaf.

## 7. Trunk owner chip

In the trunk list, wrap each card:

```tsx
<CardCornerChipStack>
  <UserLightChip
    user={entry.owner}
    currentUserRefId={topLevelInfo.user.ref_id}
  />
</CardCornerChipStack>
```

Imports: `@jupiter/core/infra/component/chips`,
`#/core/users/components/user-light-chip`.

## 8. Entity-specific foreign refs

If the entity points at other crown entities in the **owner's** workspace
(e.g. todo → aspect/chapter/goal):

- Loader already returns those linked entities from load service.
- Merge them into the viewer's select option lists for **display**.
- Keep those controls **read-only** when the linked ref is not in the
  viewer's own summaries (`lifePlanAssociationsInWorkspace` pattern in
  `todo/components/properties-editor.tsx`).
- Detach foreign aspect parent chains for tree helpers
  (`parent_aspect_ref_id: null` when merging).

## 9. Tests

Port reader/writer scenarios from todos/vacations.

### API (`itests/api/<entity>.test.py`)

- Fixture: other user with feature enabled + `grant_<entity>_access`
- No grant: load/update/archive denied
- READER: load ok; update/archive denied; assert `owner` / `access_status`
- WRITER: load+update; load+archive
- Keep auth-required test

### WebUI (`itests/webui/entities/<entity>.test.py`)

- No grant: absent from trunk; leaf shows access denial
- READER: visible in trunk; leaf read-only (inputs/archive disabled)
- WRITER: can update; can archive

Invite via `invite_users_to_entity_sync` with
`NamedEntityTag.<ENTITY>` and `AccessLevel.READER|WRITER`.

## Gotchas

| Issue | Fix |
|-------|-----|
| Find uses `parent_ref_id=collection` | Use `find_all_entities` / `parent_ref_id=None` |
| Forget then leaf loader 401 | Redirect from forget-grant; don't stay on leaf |
| Forget then stump list stale | Do not `shouldRevalidate=false` for forget-grant |
| Shared todo AspectSelect crash | Merge foreign aspect; disable life-plan edits |
| Update ACL on unchanged aspect | Only `load_entity` related crowns when value changes |
| Prop spelling | LeafPanel uses `accessable` (not `accessible`) |

## Out of scope

- Public publish (ADR 0010) is separate from access grants.
- Generic access routes (`invite`, `remove-grant`, `forget-grant`,
  `get-access-for-entity`, `AccessPanel`) are shared — reuse them.
