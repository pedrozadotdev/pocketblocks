# Desenvolvendo plug-ins de componentes de UI

Com os plug-ins do PocketBLocks, você pode desenvolver componentes personalizados que sejam consistentes com os componentes nativos para seus cenários específicos.

## Initialização

Execute os comandos a seguir:

```bash
# Iniciação do projeto
yarn create pocketblocks-plugin meu-plugin

# Vá para a raiz do projeto
cd meu-plugin

# Inicie o ambiente de desenvolvimento
yarn start
```

## Ambiente de desenvolvimento de componentes

Após executar `yarn start`, o navegador é aberto automaticamente e você entra no ambiente de desenvolvimento do componente.

<figure><img src=".gitbook/assets/build-plugins/01.jpeg" alt="Captura de tela do ambiente de desenvolvimento de componentes"><figcaption></figcaption></figure>

## Configurando o plug-in

No campo `openblocks` no arquivo `package.json`, você precisa definir as propriedades do componente. Por exemplo, a seguir está a explicação de vários campos:

- `comps` define os componentes da UI contidos no plugin. Para cada componente, o nome da chave do objeto é a identidade exclusiva e o valor são os metadados.
- `comps[algumaChaveDeComponente].name` define o nome do componente mostrado na aba **Inserir**.
- `comps[algumaChaveDeComponente].icon` define o ícone do componente mostrado na tela. Use um caminho relativo para onde o arquivo `package.json` está localizado.
- `comps[algumaChaveDeComponente].layoutInfo` define o layout do componente:
  - w: largura do componente. Contado pelo número de células da grade (intervalo: 1 - 24).
  - h: altura do componente. Contado pelo número de células da grade (intervalo: >= 1).

```bash
  "openblocks": {
    "description": "",
    "comps": {
      "ola_mundo": {
        "name": "Olá mundo",
        "icon": "./icons/ola_mundo.png",
        "layoutInfo": {
          "w": 12,
          "h": 5
        }
      },
      "contador": {
        "name": "Contador",
        "icon": "./icons/ola_mundo.png"
      }
    }
  }
```

## Exportando componentes

Para exportar todos os componentes, use `src/index.ts`, por exemplo:

```bash
import OlaMundoComp from "./OlaMundoComp";

export default {
  ola_mundo: OlaMundoComp,
};
```

O objeto exportado padrão `chave` precisa ser consistente com a `chave` configurada em `comps` no arquivo `package.json`.

## Publicando plug-ins

Ao terminar de desenvolver e testar o plugin, você poderá publicá-lo no registro npm. Faça login no registro npm localmente e execute o seguinte comando:

```
yarn build --publish
```

Se você não especificar o parâmetro `--publish`, o arquivo `tar` será salvo na pasta raiz.

## Importando plug-ins

No aplicativo PocketBLocks, clique em **Inserir** > **Extensões** > **Adicionar plug-in npm** no painel direito. <img src=".gitbook/assets/build-plugins/02.png" alt="" data-size="original">

Insira o URL ou nome do seu pacote npm e então você poderá usar seus componentes personalizados.

```bash
meu-plugin

# or

https://www.npmjs.com/package/meu-plugin
```

<figure><img src=".gitbook/assets/build-plugins/03.png" alt=""><figcaption></figcaption></figure>

## Demonstração de código

Para demonstração de código, consulte o [Github](https://github.com/internoapp/pocketblocks/tree/main/client/packages/openblocks-plugin-demo) do PocketBlocks.
