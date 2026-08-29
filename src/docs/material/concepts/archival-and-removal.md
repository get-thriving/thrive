# Archival And Removal

All entities can be _archived_ and _removed_.

Being _archived_ is simply a state of that entity that it can enter,but cannot
exit. The entity cannot change in any way after archival.

The use of archival is to get rid of old entities from the set of thingsyou are
actively looking at or that you need. For some entities thisis a natural end
state (inbox tasks, projects, etc.), for others it is rather an exception
(docs, smart lists, etc.).

Archival can be triggered by a command - either from the WebUi (the trashcanon
certain entities) or from the CLI app. It can also be triggeredon certain
entities automatically. Completed tasks and projects, or oldmemory.txt files
are treated like this.

Entities that are linked are generally archived together. So if you'rearchiving
an inbox task, it's linked notes, time events, etc. are alsoarchived.

Entities that are archived still exist in the system and can be accessed.

A _removal_ however destroys the entity permanently. It will notexist in the
system anymore, and cannot be undone.

Entities that are linked are generally removed together.

You need to first archive, and then you can remove entities.
