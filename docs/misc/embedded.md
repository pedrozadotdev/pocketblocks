# Embedding Apps in HTML Pages

It is also possible to embed PocketBlocks Apps on any HTML Page with simple Scripts, using the [PocketBlocks SDK](https://github.com/internoapp/pocketblocks/tree/main/client/packages/openblocks-sdk) through **window.$pbl**. This enables you to embed PocketBlocks Apps even without deep knowledge of React or Web Development.

## How to

To do it, all installations of PocketBlocks bring an **embedded.html** file in **pb_public** folder with a code example.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PocketBlocks Embedded</title>
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
    <h1 class="demo-title">PocketBlocks Embedded</h1>
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

You can test it accessing your local installation at `http://<host>/embedded.html?appId=<appSlug>`

{% hint style="info" %}
Do not copy the code above. Always access your **embedded.html** to get the correct code as `<HASH>` changes with updates.
{% endhint %}
