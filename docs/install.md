# Installation

In this article, you will be guided through hosting PocketBlocks on your own server:

### Manual

- Download the binary of your OS and arch from [Release Page](https://github.com/internoapp/pocketblocks/releases);
- Run `./pocketblocks serve`;
- Access the [PocketBase Admin Panel](http://localhost:8090/_) and create the admin user.

{% hint style="info" %}
PocketBlocks uses Openblocks as frontend. The `pb_public` dir is already setup but you can use `pbl_public` dir and all files from that directory will be served at http://localhost:8090/pbl/ path.
{% endhint %}

### Docker

- Get the [docker-compose.yml](https://raw.githubusercontent.com/internoapp/pocketblocks/main/docker-compose.yml) file;
- Run `docker compose up -d`;
- Access the [PocketBase Admin Panel](http://localhost:8080/_) and create the admin user.

### Fly.io

- Get the [fly.toml](https://raw.githubusercontent.com/internoapp/pocketblocks/main/fly.toml) file;
- Edit the `app-name` field;
- Run `flyctl launch`;
- Run `flyctl vol create data`;
- Run `flyctl deploy`;
- Access `https://<your-app-name>.fly.dev/_` and create the admin user.

{% hint style="info" %}
Remember to enable at least one of the [authentication methods](workspace-management/auth.md).
{% endhint %}
