# MCP

Thrive has an MCP server. MCP (the Model Context Protocol) is the standard way
for AI assistants such as Claude and ChatGPT to use other applications. Once an
assistant is connected, you can ask it things like "what's on my todo list
today?" or "add a habit to stretch every morning", and it works on your
[workspace](workspaces.md) for you.

The server covers most of what you can do in the application: todos, habits,
chores, big plans, journals, time plans, the calendar, the life plan, vacations,
people, metrics, smart lists, docs and notes. It is still young, and some
things are rough, so expect to run into the occasional edge.

An assistant acts as you, in your workspace. It can read and change the same
things you can. Only connect assistants you trust, and read what they are about
to do when they ask.

## Two Ways To Connect

There are two ways for an assistant to get access:

| | Sign in | MCP key |
| --- | --- | --- |
| How it works | The assistant sends you to Thrive to sign in and approve it | You create a key and give the assistant an address that contains it |
| Good for | Claude, Claude Code, and anything else that can sign in | Assistants that cannot sign in, and quick setups |
| Stops working when | You revoke the app | You archive the key |
| What to keep safe | Nothing, there is no secret to copy | The key and the address that contains it |

Both are managed from the **Access** page, which you get to from the account
menu in the top right of the application. It lists the apps you have approved
and your MCP keys, and it shows the two addresses used below:

* The **MCP server address**, which is what you give an assistant that signs in.
* The **MCP key address**, which is what you give an assistant when you use a
  key.

On the hosted version the MCP server address is
`https://mcp.get-thriving.com/mcp`. If you
[host Thrive yourself](../how-tos/self-hosting.md), it is
`https://your-domain.com/mcp`.

## Connecting With Sign In

The assistant asks you to sign in to Thrive in your browser, if you are not
already. Then Thrive shows the app that wants access and asks you to allow it.
After that the assistant keeps working without asking again, until you revoke
it.

### Claude

In Claude on the web or in the desktop app, open the settings and go to
Connectors. Add a custom connector, give it a name, and paste the MCP server
address. Then connect it. You are sent to Thrive to sign in and allow it.

The exact menu names change from time to time. Anthropic describes the steps in
its documentation for
[custom connectors](https://www.claude.com/docs/connectors/custom/remote-mcp).
Teams and organizations may need an owner to add the connector first.

### Claude Code

From a terminal, add the server with the MCP server address:

```bash
claude mcp add --transport http thrive https://mcp.get-thriving.com/mcp
```

Then, inside Claude Code, run `/mcp`, pick `thrive`, and choose to authenticate.
A browser window opens for you to sign in to Thrive and allow it. Claude Code
stores and refreshes what it needs from there.

### ChatGPT

Signing in from ChatGPT is not available yet. Connect ChatGPT with an
[MCP key](#connecting-with-an-mcp-key) instead.

## Connecting With An MCP Key

An MCP key works like a password for one assistant. You can have as many as you
want, and give each assistant its own so you can retire one without touching the
others.

To create one, open the **Access** page, find the MCP keys section, and choose
Add. Give the key a name, such as "Claude Code on my laptop". Thrive shows the
key once. **Copy it then**, because you will not be able to see it again. A key
looks like `mk_{environment}_{id}.{secret}`.

The MCP key address is the MCP address followed by the key:

```text
https://mcp.get-thriving.com/v1/YOUR_KEY_HERE/mcp
```

On a self-hosted Thrive it has the extra `/mcp` at the start of the path:

```text
https://your-domain.com/mcp/v1/YOUR_KEY_HERE/mcp
```

Because the key is part of the address, treat the whole address as a secret.
Don't paste it into chats, commit it to source control, or share a screenshot of
it.

### Claude Code With A Key

```bash
claude mcp add --transport http thrive "https://mcp.get-thriving.com/v1/YOUR_KEY_HERE/mcp"
```

There is nothing to authenticate afterwards, the key is the credential.

### Claude With A Key

Add a custom connector as described above, but paste the MCP key address
instead of the MCP server address. No sign in is asked for.

### ChatGPT With A Key

ChatGPT supports custom MCP connectors in developer mode, which is only offered
on some plans. Turn developer mode on in the ChatGPT settings, create a new
connector, and paste the MCP key address as the server address. Choose no
authentication, since the key in the address is the credential.

OpenAI's pages describe where these options live, and they change with plans and
releases, so check
[their documentation](https://developers.openai.com/apps-sdk/build/auth) if the
menus look different. ChatGPT connects from OpenAI's servers, so the address
must be reachable from the internet.

## Managing Access

The **Access** page is where you take access back:

* **Connected apps** lists the apps you have approved. Open one to see when it
  was approved and when it last refreshed its access, and to revoke it. Revoking stops the app from
  getting new access. An access token it already holds keeps working until it
  expires, which takes up to an hour.
* **MCP keys** lists your keys. Open one to rename it or archive it. An
  archived key stops working straight away.

If you think a key has leaked, archive it and create a new one. If you stop
using an assistant, revoke it or archive its key.

## Self-Hosting

The assistants that run in the cloud, such as Claude on the web and ChatGPT,
need to reach your server from the internet over HTTPS. Claude Code runs on your
own machine, so it can also connect to a server that is only reachable from
there. The [self-hosting guide](../how-tos/self-hosting.md) covers the addresses
and what needs to be forwarded to the MCP server.

## Other Ways In

MCP is for AI assistants. For your own scripts and programs, there is the
[API](api.md), with its own keys.
