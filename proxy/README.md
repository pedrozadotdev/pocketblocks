# PocketBlocks's proxy

This folder is where all code related to bridging Openblocks API calls to Pocketbase API sits.

## How to contribute

### Start a local backend server

#### Use prebuilt release files

Install and run a **manual version** of PocketBlocks as shown in [Installation](../docs/install.md).

### Start develop

1. Check out source code.
2. Change to proxy dir in the repository root via `cd proxy`.
3. Run `yarn` to install dependencies.
4. Run `yarn run client:prepare` to install client dependencies.
5. Run `yarn run client:build` to build client code.
6. Start dev server: `yarn run dev`.
