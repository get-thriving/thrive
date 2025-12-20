# Universes

Jupiter can be used in a number of ways, and it's best to keep these things
explicitly represented.

A universe is an independent instance of Thrive, running separately from
all other universes.

There is a universe called `thrive` which represents the global
hosted instance at `get-thriving.com`. Each self-hosted instance
is a universe too. It is identified by it's domain name.
The locally running code for development is also an universe
called `dev`.

Thus the "hosting" property is very tied to the universe.

## Environments

Each universe can have multiple environments.

The Jupiter infrastructure has a rather crips notion of environments.
They operate on two levels: system and feature.

System environments are the names we give for the code in various
distances relative to users and developers. Code can look at the
`Env` enum to understand what environment they are in.

* There is the `production` environment of which there is only one, and which consists
  of the totality of machines, cloud resources, SaaS services, etc. which handle
  the user data, the user interactions, etc. Crucially this also includes the distributed
  clients that are the `cli` app, the `MacOS` app, the `iOS` and `Android` apps,
  and the code running in all the browsers where the app is running like that.
  So it's both machines we own, and ones our customers own! The code running
  here corresponds to the code at `main:latest` or `main:vX.Y` depending on
  the distribution model. This is considered a `live` environment because it
  is accessible for users.
* There is the `staging` environmenet of which there can be many, and which are used
  by developers to showcase their work. Every time you create a PR, you also create
  a `staging` environment that runs the code in your particular branch. You can build
  and distribute client apps based on this version too. This is also considered a
  `live` environment because it is accessible to users.
* There is the `dev` enviroment of which there can be many, and which are the ones
  developers create when they're running their work on their dev machines. Every
  time you run `mise run:srv` you're creating/using such an environment.
  This is not considered `local` environment because it is not accessible to users.

Feature environments are a subset of `dev` and `staging` environments. When you
specificy a particular name in `mise run:srv --env <your-name>` you create such
an env for example, or reuse if you created it before. When you open a PR, the
same happens but in a `live` setting. These environments are separate between
each other, and start in a blank but valid state.
