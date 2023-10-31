# Installation

In this article, you will be guided through hosting PocketBlocks on your own server:

### Manual

- Download and extract the [release.zip](https://github.com/internoapp/pocketblocks/releases) file;
- Download and extract the PocketBase executable and put it in the release folder;
- Run `./pocketbase serve`;
- Access the [PocketBase Admin Panel](http://localhost:8090/_) and create the admin user.

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
