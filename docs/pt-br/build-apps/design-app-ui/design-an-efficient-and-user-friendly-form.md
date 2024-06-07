# Crie um formulário eficiente e fácil de usar

### Selecione os componentes de entrada adequados

O design UX dos componentes de entrada em um formulário é crucial para a eficiência do formulário. Componentes escolhidos corretamente podem economizar esforço dos usuários e levar a melhores resultados. PocketBlocks oferece uma variedade de componentes de entrada, incluindo entrada de texto, entrada de número, lista de opções e botões de opção, cada um dos quais funciona para diferentes cenários.

Por exemplo, quando a entrada é gerada a partir de dados, use a lista de opções para permitir que os usuários preencham a entrada rapidamente.

<figure><img src="../../.gitbook/assets/build-apps/design-app-ui/form-design/01.png" alt=""><figcaption></figcaption></figure>

Outros componentes de entrada, como rádio, são realmente úteis quando os usuários precisam escolher diretamente entre duas opções, por exemplo, para indicar se gostariam de se inscrever em uma atividade específica, como uma conferência.

<figure><img src="../../.gitbook/assets/build-apps/design-app-ui/form-design/02.png" alt=""><figcaption></figcaption></figure>

A entrada de números também é um tipo de componente comumente usado – por exemplo, em um sistema de gerenciamento de pedidos.

<figure><img src="../../.gitbook/assets/build-apps/design-app-ui/form-design/03.png" alt=""><figcaption></figcaption></figure>

### Mantenha o layout limpo e consistente

Mantenha todos os comprimentos dos campos de entrada iguais para tornar o formulário visualmente organizado e coloque todos os campos de entrada em uma única coluna para obter melhor legibilidade.

<figure><img src="../../.gitbook/assets/build-apps/design-app-ui/form-design/04.png" alt=""><figcaption></figcaption></figure>

### Agrupe o conteúdo com o divisor PocketBlocks

Use o componente PocketBlocks **Divisor** para agrupar campos de entrada relevantes para ajudar os usuários a processar informações de maneira organizada.

<figure><img src="../../.gitbook/assets/build-apps/design-app-ui/form-design/05.png" alt=""><figcaption></figcaption></figure>

### Adicionar feedback do usuário

O componente Formulário é frequentemente usado para operações CRUD, que às vezes podem ser arriscadas devido a erros humanos. Para evitar operações CRUD prejudiciais, você pode adicionar um modal de confirmação antes que os usuários enviem o formulário.

<figure><img src="../../.gitbook/assets/build-apps/design-app-ui/form-design/06.gif" alt=""><figcaption></figcaption></figure>

Da mesma forma, uma notificação após o envio dos usuários fornece feedback oportuno. Você pode adicionar uma notificação global ao botão Enviar. No PocketBlocks, você pode adicionar notificações globais de três maneiras. Veja [notificação global](style-theme-and-usability.md#global-notifications) para saber mais.

### Limpe os campos de entrada no envio

Limpar os campos de entrada em um formulário após o envio ajuda os usuários a prosseguir com os envios subsequentes. Você pode definir na guia **Propriedades** e alternar **Redefinir após envio bem-sucedido**.

<figure><img src="../../.gitbook/assets/build-apps/design-app-ui/form-design/07.png" alt=""><figcaption></figcaption></figure>

No entanto, às vezes é melhor deixar o formulário desmarcado — por exemplo, quando muitos dos valores permanecem os mesmos em envios subsequentes ou quando o usuário edita continuamente os dados. Nesses casos, você pode inserir um botão com um manipulador de eventos para limpar cada entrada ao clicar.

<figure><img src="../../.gitbook/assets/build-apps/design-app-ui/form-design/08.png" alt=""><figcaption></figcaption></figure>
