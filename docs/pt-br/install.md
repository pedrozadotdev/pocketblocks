# Instalação

Neste artigo, você vai aprender como hospedar PocketBlocks em seu próprio servidor:

### Manualmente

- Baixe o binário do seu sistema operacional e arco na [Página de Lançamento](https://github.com/internoapp/pocketblocks/releases);
- Execute o comando `./pocketblocks serve` no terminal;
- Acesse o [Aplicativo do PocketBlocks](http://localhost:8090) e crie o primeiro usuário administrador.

### Docker

- Salve o arquivo [docker-compose.yml](https://raw.githubusercontent.com/internoapp/pocketblocks/main/docker-compose.yml);
- Execute o comando `docker compose up -d` no terminal;
- Acesse o [Aplicativo do PocketBlocks](http://localhost:8080) e crie o primeiro usuário administrador.

### Fly.io

- Salve o arquivo [fly.toml](https://raw.githubusercontent.com/internoapp/pocketblocks/main/fly.toml);
- Edite o campo `app-name`;
- Execute o comando `flyctl launch` no terminal;
- Execute o comando `flyctl vol create data` no terminal;
- Execute o comando `flyctl deploy` no terminal;
- Acesse `https://<nome-do-seu-app>.fly.dev` e crie o primeiro usuário administrador.

{% hint style="info" %}
Lembre-se de que PocketBlocks usa o Openblocks como frontend. O diretório `pb_public` já está configurado, mas você pode usar o diretório `pbl_public` e todos os arquivos desse diretório serão servidos no caminho `<endereçoDoServidor>/pbl/`.
{% endhint %}
