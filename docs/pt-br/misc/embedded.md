# Incorporando aplicativos em páginas HTML

Também é possível incorporar aplicativos PocketBlocks em qualquer página HTML com scripts simples, usando o [SDK PocketBlocks](https://github.com/pedrozadotdev/pocketblocks/tree/main/client/packages/openblocks-sdk) através de **window.$pbl**. Isso permite que você incorpore aplicativos PocketBlocks mesmo sem conhecimento profundo de React ou Desenvolvimento Web.

## Como fazer

Para isso, todas as instalações do PocketBlocks trazem um arquivo **embedded.html** na pasta **pb_public** com um exemplo de código.

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PocketBlocks Embarcado</title>
    <script type="module" crossorigin src="/js/proxy.js"></script>
    <style>
      .demo-title {
        text-align: center;
      }
      .demo {
        overflow: auto;
        padding: 10px;
      }
      .ops {
        padding: 10px;
      }
      .ops button {
        margin-right: 10px;
      }
    </style>
    <script type="module" crossorigin src="/js/embedded.js"></script>
    <link rel="modulepreload" crossorigin href="/js/<HASH>.js" />
    <link rel="stylesheet" href="/assets/index-<HASH>.css" />
  </head>
  <body>
    <h1 class="demo-title">PocketBlocks Embarcado</h1>
    <div id="app" class="demo"></div>

    <script>
      window.onload = async function () {
        const url = new URL(location.href);
        const appId = url.searchParams.get("appId");
        const baseUrl = url.searchParams.get("baseUrl") || location.origin;
        if (!appId) {
          return;
        }
        const instance = await $pbl.bootstrapAppAt(
          appId,
          document.querySelector("#app"),
          {
            baseUrl,
            moduleInputs: { userName: "Lucy" },
          }
        );

        instance?.on("moduleOutputChange", (output) => {
          console.info("output change:", output);
        });

        instance?.on("moduleEventTriggered", (eventName) => {
          console.info("event triggered:", eventName);
        });

        document.querySelector("#app-ops")?.addEventListener("click", (e) => {
          const target = e.target;
          const key = target.dataset.key;
          if (key === "setModuleInputs") {
            instance?.setModuleInputs({
              userName: "Tom",
            });
          }
          if (key === "invokeMethod") {
            instance?.invokeMethod("setSlider");
          }
        });
      };
    </script>
  </body>
</html>
```

Você pode testá-lo acessando sua instalação local em `http://<host>/embedded.html?appId=<appSlug>`

{% hint style="warning" %}
Apenas **aplicativos** podem ser incorporados em páginas. Não use **navegações** ou **módulos**.
{% endhint %}

{% hint style="info" %}
Não copie o código acima. Sempre acesse seu **embedded.html** para obter o código correto pois o `<HASH>` muda com atualizações.
{% endhint %}
