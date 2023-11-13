# PocketBlocks' frontend

## How to contribute

### Start a local backend server

#### Use prebuilt release files

Install and run a **manual version** of PocketBlocks as shown in [Installation](../docs/install.md).

### Start develop

1. Check out source code.
2. Change to proxy dir in the repository root via `cd proxy`.
3. Run `yarn run client:prepare` to install dependencies.
4. Start dev server: `yarn run client:dev`.

### Before submitting a pull request

In addition, before submitting a pull request, please make sure the following is done:

1. If you add new dependency, use yarn workspace openblocks some-package to make sure yarn.lock is also updated.
