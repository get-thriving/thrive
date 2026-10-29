<!-- markdownlint-disable-file MD013 -->

# Image garbage collection cron

**Schedule:** Daily at 04:30 UTC (`30 4 * * *`), set on `ImageGcDoAllUseCase` via `background_mutation_use_case`.

**What it does:** Lists the objects of the instance in the image store and the `Image` rows (archived ones included), and removes the objects that no row names and that are at least a day old. It removes at most 200 a run, oldest first. It refuses, and fails the run, when the database has no images while the store has more than ten, or when most of a store of more than ten looks orphaned: that is a restored or mispointed database, and deleting then would take everyone's pictures. Rows whose object is gone are only counted in the log. See ADR 0018.

**Operational notes:** Nothing happens inside a transaction while the store is called. Implementation lives in core; this folder documents the WebAPI-scheduled cron only.
