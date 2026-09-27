#!/bin/sh
set -e

# Loaded before react-router-serve so Express trusts nginx's forwarded proto and host.
export NODE_OPTIONS="--require ${PWD}/trust-proxy.cjs${NODE_OPTIONS:+ ${NODE_OPTIONS}}"
exec npx react-router-serve ./build/server/index.js
