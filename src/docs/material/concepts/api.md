# API

Thrive offers an API for accessing it programmatically. It is a
typical REST API, it requires an API key to access, and it offers
Python, Node, and (in the future) more clients for more ergonomic
access from your favorite programming language.

All API access is scoped to a [workspace](workspaces.md). And while
you can do many things, you cannot do all things - creating users,
or workspaces, or any sort of operations on these are not supported.
Ditto, any "horizontal" operations like search, or
[garbage collection](../concepts/garbage-collection.md), or
[gamification](../concepts/gamification.md), are not yet exposed.

## API Docs

Live API docs are found at [{{ api_url }}]( {{ api_url }}/redoc).
There is an [OpenAPI schema]({{ api_url}}/openapi.json) published too.

In general teh API tries to behave like a REST API, with resouces
that map to the concepts covered in this documentation, and REST-like
operations on them. There are exceptions, and the API tries to be useful
rather than "correct".

## API Versions

There is the possibility of multiple API versions, even though there
is one for now, and that is unlikely to change for the forseeable future.
All API endpoints start with `/v1/` to account for this.

## API Keys

In order to access any API method, you need an API key. This can be
generated from the accounts page in the application.

You can have as many keys as you want, and you can retire/archive
keys as well.

Presently keys have full read/write access to your workspace.

These API keys act like "backend service keys". They are akin to
passwords, and must be stored securely, not committed to source
control, not emitted to logs, etc.

The general format for a key is `ak_{environment}_{id}.{secret}`.
An example would be `ak_local_2.abcdef0123456789abcdef`.

## An Example

As a prerequsite, you should install the excellent [HTTPie](https://httpie.io/).
Curl, wget, or other CLI tools can work just as well, though!

To retrieve all vacations you have defined, you can invoke the following:

```bash
http get "https://api.get-thriving.com/v1/vacations" -A bearer -a "$YOUR_KEY_HERE"
```

An example output would be:

```bash
HTTP/1.1 200 OK
content-length: 21883
content-type: application/json
date: Sat, 28 Feb 2026 08:26:34 GMT
server: uvicorn
x-jupiter-env: local
x-jupiter-hosting: local
x-jupiter-instance: prod
x-jupiter-universe: dev
x-jupiter-version: 1.3.2

{
    "entries": [
        {
            "note": null,
            "tags": [],
            "time_event_block": null,
            "vacation": {
                "archival_reason": null,
                "archived": false,
                "archived_time": null,
                "created_time": "2020-06-10T20:26:43+00:00",
                "end_date": "2020-06-07",
                "last_modified_time": "2023-01-28T19:31:00+00:00",
                "name": "Vacation at Breaza",
                "ref_id": "9",
                "start_date": "2020-06-05",
                "vacation_collection_ref_id": "1",
                "version": 5
            }
        },
    .... and much more
```

To supply some query parameters you can use:

```bash
http get "http://api.get-thriving.com/v1/vacations" \
    allow_archived==false include_notes==true \
    -A bearer -a "$YOUR_KEY_HERE"
```

And you'll get something like:

```bash
HTTP/1.1 200 OK
content-length: 23276
content-type: application/json
date: Sat, 28 Feb 2026 14:12:55 GMT
server: uvicorn
x-jupiter-env: local
x-jupiter-hosting: local
x-jupiter-instance: prod
x-jupiter-universe: dev
x-jupiter-version: 1.3.2

{
    "entries": [
        {
            "note": {
                "archival_reason": null,
                "archived": false,
                "archived_time": null,
                "content": [
                    {
                        "correlation_id": "p-Vh1Qv04k",
                        "kind": "paragraph",
                        "text": "A note here"
                    }
                ],
                "created_time": "2026-02-28T14:08:36.487504+00:00",
                "last_modified_time": "2026-02-28T14:08:39.484310+00:00",
                "name": "vacation with id #9",
                "namespace": "vacation",
                "note_collection_ref_id": "1",
                "ref_id": "2539",
                "source_entity_ref_id": "9",
                "version": 2
            },
            "tags": [],
            "time_event_block": null,
            "vacation": {
                "archival_reason": null,
                "archived": false,
                "archived_time": null,
                "created_time": "2020-06-10T20:26:43+00:00",
                "end_date": "2020-06-07",
                "last_modified_time": "2023-01-28T19:31:00+00:00",
                "name": "Vacation at Breaza",
                "ref_id": "9",
                "start_date": "2020-06-05",
                "vacation_collection_ref_id": "1",
                "version": 5
            }
        },
        ... more output here
```
