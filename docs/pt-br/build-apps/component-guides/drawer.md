# Drawer

No PocketBlocks, **Drawer** é uma barra lateral sobreposta para exibir informações ou realizar operações, sem interromper o fluxo de trabalho na janela principal.

O exemplo a seguir cria um carrinho de compras usando uma gaveta.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/drawer/01.gif" alt=""><figcaption></figcaption></figure>

## Layout

Quando inserida pela operação de arrastar e soltar, um **Drawer** flutua no lado direito (por padrão) da janela principal. Em seguida, você pode adicionar componentes ao **Drawer** de acordo com suas necessidades. No modo de edição de um **Drawer**, outros componentes na tela não são editáveis.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/drawer/02.png" alt=""><figcaption></figcaption></figure>

{% hint style="info" %}
Quando um Drawer é fechado, você pode reabri-lo clicando no rótulo correspondente na guia **Modais** no painel esquerdo.
{% endhint %}

### Posição

Na aba **Propriedades**, você pode definir a posição do Drawer. A posição padrão é o lado direito da janela principal.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/drawer/03.png" alt=""><figcaption></figcaption></figure>

### Redimensionando

Na aba **Propriedades**, você pode definir a largura do drawer em pixels ou porcentagem. Observe que a altura de um drawer é igual à da janela principal e não é personalizável.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/drawer/04.png" alt=""><figcaption></figcaption></figure>

## Eventos

Você pode fazer referência a um drawer no código JS em qualquer lugar do seu aplicativo ou chamá-lo por meio de uma ação de "componente de controle" em **Propriedades** > **Interação** > **Manipuladores de eventos**.

As seções a seguir orientam você sobre como abrir e fechar um drawer clicando em um botão em um aplicativo de compras online.

### Acionando openDrawer

Normalmente, em um aplicativo, você aciona a abertura de um drawer por meio de um evento como clicar em um botão. Por exemplo, abrir um drawer para exibir o carrinho de compras é implementado nas etapas a seguir.

1. Adicione um botão e renomeie-o como `irParaCarro`.
2. Defina o manipulador de eventos do botão. Selecione "Componente de controle" como **Ação** e selecione o componente "carrinho" e o método "openDrawer". Todas essas configurações são salvas automaticamente.&#x20;

   <figure><img src="../../.gitbook/assets/build-apps/component-guides/drawer/05.png" alt=""><figcaption></figcaption></figure>

3. Clique no botão `irParaCarro` e o drawer vinculado(carrinho) será aberto.

### Acionando o fechamento do drawer

Acionar "closeDrawer" é semelhante a acionar "openDrawer". Ao configurar o manipulador de eventos, selecione o método "closeDrawer". Por exemplo, fechar um drawer que exibe o carrinho de compras é implementado nas etapas a seguir.

1. Adicione um botão e renomeie-o como `voltarShopping`.
2. Defina o manipulador de eventos do botão. Selecione "Componente de controle" como **Ação** e selecione o componente "carrinho" e o método "closeDrawer". Todas essas configurações são salvas automaticamente.&#x20;

   <figure><img src="../../.gitbook/assets/build-apps/component-guides/drawer/06.png" alt=""><figcaption></figcaption></figure>

3. Clique no botão “Continuar Comprando” e o drawer vinculado (carrinho) é fechado.
