# Plan: Common Person Entity

## Overview
Introduce a `Person` leaf-support entity under `common/sub/persons/`, mirroring the `Note` pattern exactly. Each person record has a human-readable `name`, a `namespace` (which entity type created it), and a `source_entity_ref_id` linking back to the originating entity. The management UI lists persons filterable by namespace; the detail page allows name update, archive, and remove — but **no create** from the UI.

---

## Files to Create

### 1. `src/core/jupiter/core/common/sub/persons/__init__.py`
Empty package init.

### 2. `src/core/jupiter/core/common/sub/persons/namespace.py`
`PersonNamespace` enum with values:
- `PRM = "prm"`
- `INBOX_TASK = "inbox-task"`
- `BIG_PLAN = "big-plan"`
- `SCHEDULE = "schedule"`
- `HABIT = "habit"`
- `CHORE = "chore"`
- `SMART_LIST_ITEM = "smart-list-item"`
- `METRIC_ENTRY = "metric-entry"`

### 3. `src/core/jupiter/core/common/sub/persons/name.py`
`PersonName(EntityName)` value type decorated with `@hashable_value`.

### 4. `src/core/jupiter/core/common/sub/persons/collection.py`
`PersonCollection(TrunkEntity)`:
- `workspace: ParentLink`
- `persons = ContainsMany(Person, person_collection_ref_id=IsRefId())`
- `new_person_collection(ctx, workspace_ref_id)` static factory

### 5. `src/core/jupiter/core/common/sub/persons/root.py`
`Person(LeafSupportEntity)`:
- `person_collection: ParentLink`
- `namespace: PersonNamespace`
- `source_entity_ref_id: EntityId`
- `name: PersonName` (explicitly set, not auto-generated)
- `new_person(ctx, person_collection_ref_id, namespace, source_entity_ref_id, name)` static factory
- `update(ctx, name: UpdateAction[PersonName])` update action

`PersonRepository(LeafEntityRepository[Person], ABC)`:
- `load_for_source(namespace, source_entity_ref_id, allow_archived) -> Person`
- `load_optional_for_source(namespace, source_entity_ref_id, allow_archived) -> Person | None`

### 6. `src/core/jupiter/core/common/sub/persons/service/__init__.py`
Empty.

### 7. `src/core/jupiter/core/common/sub/persons/service/archive.py`
`PersonArchiveService` with:
- `archive(ctx, uow, person, archival_reason)` — marks person archived
- `archive_for_source(ctx, uow, namespace, source_entity_ref_id, archival_reason)` — loads optional + archives

### 8. `src/core/jupiter/core/common/sub/persons/service/remove.py`
`PersonRemoveService` with:
- `remove(ctx, uow, person)` — hard-deletes person

### 9. `src/core/jupiter/core/common/sub/persons/use_case/__init__.py`
Empty.

### 10. `src/core/jupiter/core/common/sub/persons/use_case/create.py`
`PersonCreateArgs(namespace, source_entity_ref_id, name)` → `PersonCreateResult(new_person)`
`@mutation_use_case(exclude_component=[AppCore.CLI])`
Loads `PersonCollection` from workspace, creates and saves person.

### 11. `src/core/jupiter/core/common/sub/persons/use_case/load.py`
`PersonLoadArgs(ref_id, allow_archived)` → `PersonLoadResult(person)`
`@readonly_use_case(exclude_component=[AppCore.CLI])`

### 12. `src/core/jupiter/core/common/sub/persons/use_case/find.py`
`PersonFindArgs(allow_archived, filter_namespace, filter_ref_ids)` → `PersonFindResult(persons)`
`@readonly_use_case(exclude_component=[AppCore.CLI])`
Filters on namespace and ref_ids using `find_all_generic`.

### 13. `src/core/jupiter/core/common/sub/persons/use_case/update.py`
`PersonUpdateArgs(ref_id, name: UpdateAction[PersonName])` → `None`
`@mutation_use_case(exclude_component=[AppCore.CLI])`

### 14. `src/core/jupiter/core/common/sub/persons/use_case/archive.py`
`PersonArchiveArgs(ref_id)` → `None`
`@mutation_use_case(exclude_component=[AppCore.CLI])`
Delegates to `PersonArchiveService`.

### 15. `src/core/jupiter/core/common/sub/persons/use_case/remove.py`
`PersonRemoveArgs(ref_id)` → `None`
`@mutation_use_case(exclude_component=[AppCore.CLI])`
Delegates to `PersonRemoveService`.

### 16. `src/core/jupiter/core/common/sub/persons/impl/__init__.py`
Empty.

### 17. `src/core/jupiter/core/common/sub/persons/impl/repository.py`
`SqlitePersonRepository(SqliteLeafEntityRepository[Person], PersonRepository)`:
- `load_for_source` — SELECT where namespace=? AND source_entity_ref_id=? (raises if not found)
- `load_optional_for_source` — same but returns `None`
Pattern copied exactly from `SqliteNoteRepository`.

### 18. `src/core/jupiter/core/common/sub/persons/namespace.ts`
`personNamespaceName(namespace: PersonNamespace): string` — switch returning human names for each namespace value.

### 19. `src/core/jupiter/core/common/sub/persons/component/person-namespace-tag.tsx`
`PersonNamespaceTag({ namespace })` — renders a `SlimChip` with the namespace name. Same pattern as `NoteNamespaceTag`.

### 20. `src/webui/app/routes/app/workspace/core/persons.tsx`
Trunk route — calls `personFind({ allow_archived: false })`, shows list of persons sorted by namespace then name, filterable by namespace via `FilterManyOptions`. Shows `PersonNamespaceTag` per entry. No "New" button. Empty state message: "Persons are attached to entities and cannot be created independently."

### 21. `src/webui/app/routes/app/workspace/core/persons/$id.tsx`
Leaf route — calls `personLoad({ ref_id, allow_archived: true })`. Renders:
- `EntitySummaryLink` showing the source entity (using a namespace→entity-tag mapping)
- Editable name field (OutlinedInput)
- Archive + Remove buttons (no create)
Action handles `update`, `archive`, `remove` intents.

---

## Files to Modify

### 22. `src/core/jupiter/core/workspaces/root.py`
Add import of `PersonCollection` and:
```python
person_collection = ContainsOne(PersonCollection, workspace_ref_id=IsRefId())
```

### 23. `src/core/jupiter/core/application/use_case/init.py`
Import `PersonCollection` and add initialization block (mirroring the `NoteCollection` block):
```python
new_person_collection = PersonCollection.new_person_collection(
    ctx=context.domain_context,
    workspace_ref_id=new_workspace.ref_id,
)
new_person_collection = await uow.get_for(PersonCollection).create(new_person_collection)
```

### 24. `src/core/jupiter/core/infra/component/sidebar.tsx`
Add a new `<ListItem>` after the Notes entry in the "Core" section:
```tsx
<ListItem disablePadding>
  <ListItemButton to="/app/workspace/core/persons" component={Link} onClick={onClickNavigation}>
    <ListItemIcon>👤</ListItemIcon>
    <ListItemText primary="Persons" />
  </ListItemButton>
</ListItem>
```

---

## Framework Auto-Discovery
No manual route registration is needed. `build_from_module_root(jupiter.core)` auto-discovers:
- All `@entity` classes → schema codecs
- All `SqliteLeafEntityRepository` subclasses → repository impls
- All `@mutation_use_case` / `@readonly_use_case` classes → HTTP POST endpoints

---

## What is NOT included
- No integration with existing PRM person, InboxTask, etc. to auto-create common persons — that is follow-up work when those entities are updated.
- No "create" button in the management UI.
- No `PersonLink` many-to-many join table (not needed per the spec).
