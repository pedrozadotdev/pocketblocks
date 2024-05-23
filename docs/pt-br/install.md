# Installation

In this article, you will be guided through hosting PocketBlocks on your own server:

### Manual

- Download the binary of your OS and arch from [Release Page](https://github.com/internoapp/pocketblocks/releases);
- Run `./pocketblocks serve`;
- Access [PocketBlocks App](http://localhost:8090) and create the first admin user.

### Docker

- Get the [docker-compose.yml](https://raw.githubusercontent.com/internoapp/pocketblocks/main/docker-compose.yml) file;
- Run `docker compose up -d`;
- Access [PocketBlocks App](http://localhost:8080) and create the first admin user.

### Fly.io

- Get the [fly.toml](https://raw.githubusercontent.com/internoapp/pocketblocks/main/fly.toml) file;
- Edit the `app-name` field;
- Run `flyctl launch`;
- Run `flyctl vol create data`;
- Run `flyctl deploy`;
- Access `https://<your-app-name>.fly.dev` and create the first admin user.

{% hint style="info" %}
Remember that PocketBlocks uses Openblocks as the frontend. The `pb_public` dir is already set up but you can use the `pbl_public` dir and all files from that directory will be served at `<serverAddress>/pbl/` path.
{% endhint %}
