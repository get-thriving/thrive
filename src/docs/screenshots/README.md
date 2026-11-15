# Docs screenshots

The pictures in the docs (and the showcase pictures of the README) are not taken
by hand. They are generated from a demo workspace, described in
[screenshots.toml](screenshots.toml). When the software changes, run one command
and the pictures follow:

```bash
mise run build:docs-screenshots
```

Then look at the result with `git status src/docs assets` and `git diff`, and
commit the pictures that changed.

## What it does

1. Starts a **separate, fresh instance** called `docs-screenshots` (its own
   ports and database, cleared on every run), so it never touches your dev data.
2. Creates the demo user and fills the workspace through the WebAPI with the
   `[[seed]]` steps of the config.
3. Logs in with Playwright and takes every `[[shot]]` of the config, with the
   screen size of its profile.
4. Copies each picture to the places listed in its `assets`, below
   `src/docs/material`, and stops the instance.

The pictures are in `.build-cache/docs-screenshots/out` too.

## Useful flags

| Flag | What it does |
| ---- | ------------ |
| `--list` | List the shots and where they are installed. |
| `--only a,b` | Only take the shots with these names or name prefixes (`--only keyboard-`). |
| `--no-install` | Do not copy into the docs, leave the pictures in the out folder. |
| `--keep` | Leave the instance running, to look around in the demo workspace. |
| `--reuse` | Use the running instance and the data of the last run, to fix a single shot quickly. |
| `--seed-only` | Create the data and stop (useful with `--keep`). |
| `--headed` | Show the browser. |
| `--instance <name>` | Use another instance name. |

The demo user signs in with the `[user]` email and password of the config.
After `--keep` open the instance with `mise run run:web --instance docs-screenshots`.

## The config

### `[user]` and `[workspace]`

Who the demo user is, and which features the workspace has.

### `[profile.<name>]`

A kind of screen: `width`, `height`, `scale` (device pixel ratio), `mobile`
(touch device) and `trim_bottom` (the dev builds show a banner along the bottom
of the page, which is cut off; 26 by default). The config has `desktop`,
`mobile` and `form` (small window for the logged-out forms).

### `[[seed]]`: the data

Each step is a call to the WebAPI, or a few special actions.

```toml
[[seed]]
op = "todo.todo_task_create"          # api/todo/todo_task_create.py of the client
args = { name = "Renew the passport", is_key = false, eisen = "important",
         difficulty = "medium", due_date = "{{ day(20) }}" }
save = "passport"                     # remember the id of what was created
```

* `op` is the module of the generated Python client, below `api/`. The body is
  built from `args` with the model `models/<last part of op>_args.py`. Use
  `args_model` and `args_class` if the names do not follow this rule.
* `args` are written as JSON would be (the `snake_case` names, enums as their
  string). A string that is a single `{{ expression }}` keeps its type.
* `fill_unchanged = true` fills the fields of an update that are not given with
  "do not change", so only the ones you name are changed.
* `foreach = [ ... ]` runs the step once per item. Inside, `item` is the item and
  `i` its position, so `args = "{{ item }}"` uses the item as the arguments.
  `foreach` can also be an expression: `"{{ [... for k in range(12)] }}"`.
* `save = "name"` saves the id of the thing the call created (the first `new_*`
  of the result). For other results, `saves = [{ name = "x", path = "entries.0.aspect.ref_id" }]`
  follows a dotted path in the result. Add `where = { "habit.name" = "~Get at" }`
  to pick the first item of a list that matches (`~` for substring, `"!null"`
  for present) and `take = "inbox_task.ref_id"` for the field to keep. `all = true`
  keeps all matches, and `optional = true` skips instead of failing.
* `{{ ref("name") }}` is a saved id. It can be used in later seed steps and in
  the `path` of shots.
* `action = "backfill_history"` is not a call. It gives the workspace a past:
  generates the tasks of the last `days` days and finishes `done_ratio` of the
  ones that are late, so habit streaks and reports have something to show.

The steps run in order, so create things before they are used. The data is
relative to the day of the run: `day(n)` is an ISO date `n` days from today,
`pdate(n)` the same as a life plan date, `shortdate(n)` as `20 Nov`.

### `[[shot]]`: the pictures

```toml
[[shot]]
name = "keyboard-find"                # picture in .build-cache/docs-screenshots/out
assets = ["assets/keyboard-find.png"] # installed here, below src/docs/material
path = "/app/workspace/apps/todos"    # where to go
steps = [{ press = "f" }, { type = "dent", wait = 4000 }]
```

* `assets` is a list: the same picture can feed several places, like the
  showcase pictures that the README also uses. Installing writes through
  symlinks, so those stay in sync.
* `profile` picks the screen (`desktop` by default). `login = false` takes the
  picture of a logged-out page. `settle_ms` waits longer after loading.
  `clip = { x, y, width, height }` crops (the page, minus the dev banner, by
  default). `retries` is the number of attempts (2 by default).
* `continue_from_previous = true` stays on the page that the previous shot ended
  on, instead of loading `path`. With `--only` the previous shot runs too.
* `steps` is a list. Each one does one thing, then waits `wait` milliseconds
  (500 by default):

| Step | Does |
| ---- | ---- |
| `press = "l"` or `press = ["l", "Shift+J"]` | Press keys. |
| `type = "gym"` | Type text. |
| `type_lines = ["a", "b"]` | Type lines, each followed by Enter. |
| `click_text = "Team sync"` (`exact`, `nth`) | Click the element with this text. |
| `click_role = "button"`, `name = "Invite"` (`exact`, `nth`) | Click by role and name. |
| `click = "#account-menu"` (`nth`) | Click a CSS selector. |
| `fill = "form input"`, `value = "text"` | Fill an input. |
| `scroll_to_text = "Occasions"` (`exact`, `nth`) | Scroll to some text. |
| `wheel = 900` | Scroll the page by pixels. |
| `focus_editor = true` | Click into the first rich text editor. |
| `wait_until_button_enabled = "Run Report"` | Wait for a button to be usable. |
| `goto = "/app/workspace"` | Load another page. |

Shots that change data (the tutorial creates a todo) go last in the file, so
they do not leak into the others.

## Adding a picture

1. Add the `[[shot]]`, and any data it needs as `[[seed]]` steps.
2. Try it: `mise run build:docs-screenshots --only my-shot --no-install`, and
   look at `.build-cache/docs-screenshots/out/my-shot.png`. Use `--keep` and
   then `--reuse` to iterate without recreating the data every time.
3. Run it without `--no-install` and reference the new file from the docs page.

## Not covered

A few pictures cannot come from the demo workspace and stay manual: the ones of
the install flow, the diagrams, and the pictures of screens that need a second
user or an external service.

The code is in this folder: `run.py` (the command line), `seed.py` (the data),
`capture.py` (Playwright) and `templating.py` (the `{{ }}` expressions). It runs
in the `itests` Python environment, which has the WebAPI client and Playwright.
