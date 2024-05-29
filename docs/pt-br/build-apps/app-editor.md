---
description: Dê uma rápida olhada no editor de aplicativos antes de começar
---

# Editor de aplicativos

No PocketBlocks, o editor de aplicativos é onde você monta componentes, cria funções javascript para interagir com os dados do PocketBase e publica seus aplicativos. É composto por cinco áreas:

1. Barra de ferramentas
2. Canvas
3. Navegador de dados
4. Editor de consultas
5. Painel de componentes e propriedades

<figure><img src="../.gitbook/assets/build-apps/app-editor/01.png" alt=""><figcaption></figcaption></figure>

## Barra de ferramentas

A barra de ferramentas é composta por uma barra superior e uma barra lateral esquerda.

<figure><img src="../.gitbook/assets/build-apps/app-editor/01.png" alt=""><figcaption></figcaption></figure>

Na barra superior, você pode configurar seu aplicativo da seguinte forma:

- Alterar o nome do aplicativo
- Exportar para um arquivo JSON
- Controlar a visibilidade de outras áreas
- Compartilhe seu aplicativo
- Visualize e implante seu aplicativo
- Verifique as versões do histórico

Na barra lateral esquerda, algumas opções estão disponíveis como segue:

- Mostrar ou ocultar o **Navegador de dados**
- Defina o tamanho da tela e o tema do aplicativo
- Gerenciar scripts e estilos CSS
- Iniciar tutorial para editor de aplicativos
- Mostrar atalhos de teclado

## Canvas

O Canvas no centro do editor é onde você projeta e vê a UI geral. Arraste e solte componentes na tela, vincule-os a manipuladores de dados e eventos e monte-os para criar um aplicativo poderoso e agradável.

<figure><img src="../.gitbook/assets/build-apps/app-editor/03.gif" alt=""><figcaption></figcaption></figure>

Confira [Design UI do aplicativo](./design-app-ui) para práticas de layout de UI.

## Navegador de dados

O navegador de dados no painel esquerdo contém as seções **Consultas**, **Componentes** e **Globais**. Aqui você pode inspecionar os dados em uma estrutura em árvore. Por exemplo, para verificar os dados retornados de uma consulta ou componente específico, encontre seu item na seção pertencente e clique em<img src="../.gitbook/assets/build-apps/app-editor/04.png" alt="" data-size="line">para expandir.

<figure><img src="../.gitbook/assets/build-apps/app-editor/05.gif" alt=""><figcaption></figcaption></figure>

## Editor de consultas

O editor de consultas na parte inferior consiste em duas seções: lista de consultas (com as guias **Consultas** e **Metadados**) à esquerda e configurações de consulta (com **Geral**, **Notificação** e **Guias Avançadas**) à direita. Crie consultas para interagir com a API Pocketbase aqui.

<figure><img src="../.gitbook/assets/build-apps/app-editor/06.png" alt=""><figcaption></figcaption></figure>

Você pode acessar o SDK do Pocketbase através do objeto **window.pb**.

## Painel de componentes e propriedades

O painel de componentes e propriedades está localizado à direita da janela. Arraste os componentes para a tela a partir da guia **Inserir** e edite as propriedades dos componentes na guia **Propriedades**.

<img src="../.gitbook/assets/build-apps/app-editor/07.png" alt="" data-size="original">![](../.gitbook/assets/build-apps/app-editor/08.png)

Quando um componente é selecionado na tela, a guia **Propriedades** será ativada automaticamente e exibirá as propriedades desse componente.
