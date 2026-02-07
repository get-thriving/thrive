# Universes

Jupiter can be used in a number of ways, and it's best to keep these things
explicitly represented.

A universe is an independent instance of Thrive, running separately from
all other universes, under the control of distinct organisations, and with
absolutely no resources shared between them.

There is a universe called `thrive` which represents the global
hosted instance at `get-thriving.com`. Each self-hosted instance
is a universe too. It is identified by it's domain name.
The locally running code for development also lives in a universe
called `dev` (with semantics similar to `localhost` in networking).
A last reseverd universe name is `thrive-sh-test` for self-hosted
testing as part of the development process.

An universe can contain one or more _environments_. An environment
is useful to delineate certain parts of an universe for particular
uses. It is common for some resources to be specific to a single
environment, and not to the whole universe.

The `thrive` universe has the `production` and `staging` environments.
The `production` one represents those instances that serve real user
traffic, are exposed to the world. The `staging` environment is used
in development to test new features, or experiment. Self-hosted
universes typically have a single environment called `production`,
though there can be more, as it is a flexible concept. By convention
`dev` only has the `local` environment, and `thrive-th-test` has the
`staging` environment.

Finally, environments contain one or more _instances_. An instance
is a single running copy of all the Thrive software which makes reference
to a distinct copy of data. Depending on the situation this software
might run on one machine as several processes, or distributed across
many machines in a large-scale fashion. Certain resources (the core
databases, search indices, etc.) are segregated in an instance, while
others are shared with other instances in the environment or in the
universe.

The `thrive` universe, and the `production` environment has
the big central instance called `main`. When accessing `get-thriving.com`
this is the one that is accessed. Presently there are no other
instances here, but one could imagine more instances for large
scale customers wanting a separate setup. The `staging` environment
supports multiple ephemeral instances, created one per PR raised
on GitHub, and closed when the PR is merged or abandoned. Any
self-hosted universe will typically have one instance, but it is
relatively easy to generate more, either for testing or for longer
term purposes. Finally, in the `dev` universe and `local` environment
it is very common to generate many instances in the process of
development and testing, all existing on the local dev machine.

Thus the "hosting" property is very tied to the universe.
