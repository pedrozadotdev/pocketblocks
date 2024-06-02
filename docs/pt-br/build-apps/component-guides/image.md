# Imagem

Use o componente **Imagem** para apresentar informações nos seus aplicativos de maneira vívida. PocketBlocks suporta a adição de uma imagem via URL e dados codificados em base64.

## URL

Arraste o componente **Image** para a tela ou para um **Container**. Clique no componente **Imagem** e a guia **Propriedades** será exibida à direita. Você pode definir o URL para exibir uma imagem.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/image/01.png" alt=""><figcaption></figcaption></figure>

## Dados codificados em Base64

Você também pode inserir uma imagem por meio de dados codificados em base64. Certifique-se de que a fonte da imagem codificada comece com `data:image/FORMATODAIMAGEM;base64,` ou simplesmente `data:image;base64,`.

{% hint style="warning" %}
Não esqueça da vírgula no final do prefixo:

<mark style="background-color:yellow;">`data:image/FORMATODAIMAGEM;base64`</mark><mark style="background-color:yellow;">**`,`**</mark> <mark style="background-color:yellow;">`OS_DADOS_DA_SUA_IMAGEM_EM_BASE64`</mark>

<mark style="background-color:yellow;">`data:image;base64`</mark><mark style="background-color:yellow;">**`,`**</mark><mark style="background-color:yellow;">`OS_DADOS_DA_SUA_IMAGEM_EM_BASE64`</mark>
{% endhint %}

<figure><img src="../../.gitbook/assets/build-apps/component-guides/image/02.png" alt=""><figcaption></figcaption></figure>

### Demo: carreguando e exibindo uma imagem

Um caso de uso comum para exibição de imagens base64 seria combinar um componente **Upload de arquivo** com um componente **Imagem**.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/image/03.png" alt=""><figcaption></figcaption></figure>

Aqui está o código JS que concatena o prefixo com os dados codificados em base64 do arquivo enviado por meio de `arquivo1.value[0]`.

```javascript
{
  {
    "data:image/jpeg;base64," + arquivo1.value[0];
  }
}
```

## Definindo visualização de clique para uma imagem

Ative **Suporte a visualização de clique** na guia **Propriedades** para permitir que os usuários visualizem a imagem em tamanho real. Passe o mouse sobre a imagem e você verá **👁 Visualização**. Então, você pode clicar para visualizar.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/image/04.png" alt=""><figcaption></figcaption></figure>

## Definindo o estilo de uma imagem

Em **Propriedades** > **Estilo**, altere a cor da borda e defina o **Raio da borda** em pixels ou em porcentagem.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/image/05.png" alt=""><figcaption></figcaption></figure>
