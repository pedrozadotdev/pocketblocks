# Módulos

Ao criar um aplicativo, você deseja reutilizar componentes e consultas em diferentes aplicativos. Módulos são o que você precisa. Um módulo compreende componentes e consultas. Você pode inserir um módulo em um aplicativo ou em outros módulos (referidos como _aplicativos externos_ no restante deste documento) e ele funciona como um único componente.&#x20;

<figure><img src="../.gitbook/assets/build-apps/module/01.png" alt=""><figcaption><p>Construindo um<a href="module.md#demo-a-statistics-module">módulo estático</a></p></figcaption></figure>

<figure><img src="../.gitbook/assets/build-apps/module/02.png" alt=""><figcaption><p>Reutilize este módulo em qualquer lugar</p></figcaption></figure>

## Noções básicas do módulo

### Criando um novo módulo

Selecione **Novo > Módulo** no canto superior direito da página inicial para entrar no editor do módulo.

<figure><img src="../.gitbook/assets/build-apps/module/03.png" alt=""><figcaption></figcaption></figure>

### Definindo configurações do módulo

Você pode definir as configurações de um módulo na guia **Configurações** do navegador de dados:

<figure><img src="../.gitbook/assets/build-apps/module/04.png" alt=""><figcaption></figcaption></figure>

- **Entrada**: parâmetros passados ​​para o módulo atual a partir de aplicativos externos.&#x20;

  <figure><img src="../.gitbook/assets/build-apps/module/05.png" alt=""><figcaption></figcaption></figure>

- **Saída**: dados expostos a aplicativos externos.&#x20;

  <figure><img src="../.gitbook/assets/build-apps/module/06.png" alt=""><figcaption></figcaption></figure>

- **Método**: métodos expostos a aplicativos externos. Por exemplo, você pode definir um módulo com um método `redefinicaoDeTitulo`, para que aplicativos externos possam chamá-lo para redefinir o título do módulo.&#x20;

  <figure><img src="../.gitbook/assets/build-apps/module/07.png" alt=""><figcaption></figcaption></figure>

- **Evento**: os eventos do módulo podem ser tratados por aplicativos externos. Por exemplo, você pode definir um evento chamado `AlteracaoDeDado`, para que aplicativos externos possam adicionar manipuladores de eventos a ele assim que o evento `AlteracaoDeDado` for disparado pelo módulo.&#x20;

  <figure><img src="../.gitbook/assets/build-apps/module/08.png" alt=""><figcaption></figcaption></figure>

Para mais detalhes, consulte o capítulo [Configurações do módulo](module.md#module-settings).

### UI do módulo de design

As outras áreas do editor de módulos são semelhantes às do editor de aplicativos web. Insira componentes e crie consultas da mesma forma que o processo de criação de aplicativos. No editor de módulo, você pode redimensionar um módulo arrastando o canto inferior direito para o tamanho padrão desejável. Alterne o botão no painel **Propriedades** para controlar se a **altura do componente é dimensionada com o contêiner**. \*\*\*\* Isso funciona apenas para componentes de altura fixa dentro do módulo.&#x20;

<figure><img src="../.gitbook/assets/build-apps/module/09.gif" alt=""><figcaption></figcaption></figure>

### Inserir módulo em aplicativos ou outros módulos

Ao editar um aplicativo ou módulo, selecione **Inserir > Extensões > Módulos** para exibir os módulos aos quais você tem acesso.&#x20;

<img src="../.gitbook/assets/build-apps/module/10.png" alt="" data-size="original">

Em seguida, arraste e solte o módulo na tela, defina os parâmetros de entrada e altere os estilos dentro do painel **Propriedades** do módulo.

<figure><img src="../.gitbook/assets/build-apps/module/11.png" alt=""><figcaption></figcaption></figure>

Inspecione os dados expostos pelo módulo no navegador de dados.&#x20;

<figure><img src="../.gitbook/assets/build-apps/module/12.png" alt=""><figcaption></figcaption></figure>

## Configurações do módulo

### Entrada

As entradas do módulo são parâmetros passados ​​ao módulo por aplicativos externos. Os tipos de entrada suportados são **dado**, **texto**, **número**, **lista**, **booleano**, \***\* e **consulta**. Os primeiros cinco são tipos de dados. Escolha **dados** para não restringi-lo a um tipo de dados específico. Ao escolher o tipo de **consulta**, você pode passar uma consulta de aplicativos externos e acioná-la dentro do módulo. Em seguida, você pode referenciar um parâmetro de entrada do módulo por seu **nome\*\*.&#x20;

<figure><img src="../.gitbook/assets/build-apps/module/13.png" alt=""><figcaption></figcaption></figure>

### Demonstração: Um módulo de estatísticas

Esta seção orienta você pelas etapas para criar um módulo de estatísticas e reutilizá-lo em um aplicativo. & #x20;

<figure><img src="../.gitbook/assets/build-apps/module/02.png" alt=""><figcaption></figcaption></figure>

1. Criando entradas de módulo:

Na guia **Configurações**, clique em **+** **Adicionar** para criar uma nova entrada de módulo e, em seguida, defina seu **nome**, **tipo**, **valor padrão** (opcional) e **dica** (opcional). Neste exemplo, três entradas de módulo são adicionadas: duas entradas de texto `título`, `imagemUrl` e uma entrada numérica `contador`:&#x20;

<figure><img src="../.gitbook/assets/build-apps/module/14.png" alt=""><figcaption></figcaption></figure>

2. Projetando a UI do módulo:
1. Insira um **contêiner** no módulo.
1. Adicione dois componentes **text** e um componente **image** ao contêiner.
1. Ajuste suas propriedades, como layout, altura e estilo.
1. Vincule o valor dos componentes às entradas do módulo. Por exemplo, a **Fonte da imagem** está vinculada ao parâmetro de entrada `imagemUrl.value`.&#x20;

<figure><img src="../.gitbook/assets/build-apps/module/15.png" alt=""><figcaption></figcaption></figure>

1. Insira o módulo recém-criado em um aplicativo ou módulo externo e você poderá passar valores para configurar suas propriedades.

   <figure><img src="../.gitbook/assets/build-apps/module/16.png" alt=""><figcaption></figcaption></figure>

1. Reutilize o módulo várias vezes, passando diferentes valores de entrada.&#x20;

   <figure><img src="../.gitbook/assets/build-apps/module/02.png" alt=""><figcaption></figcaption></figure>

#### Teste de entrada

Para testar rapidamente a eficácia dos parâmetros de entrada durante a edição de um módulo, você pode usar a função **Teste de entrada**. No **editor de módulo**, selecione o módulo inteiro para realizar testes com dados de entrada simulados no painel **Propriedades**. No exemplo mencionado anteriormente, você pode definir os valores de teste para as três entradas do módulo: `titulo`, `imagemUrl` e `contador`, conforme mostrado abaixo:&#x20;

<figure><img src="../.gitbook/assets/build-apps/module/17.png" alt=""><figcaption></figcaption></figure>

### Saída

As saídas do módulo são os dados expostos a um aplicativo ou outros módulos. Você pode inspecionar as saídas de um módulo no navegador de dados e acessá-las via código JavaScript em `{{ }}`. O exemplo a seguir mostra as saídas em um módulo de filtragem de usuário.&#x20;

<figure><img src="../.gitbook/assets/build-apps/module/18.png" alt=""><figcaption></figcaption></figure>

Em seguida, você pode verificar e referenciar as saídas de um módulo em aplicativos ou outros módulos que o utilizam.&#x20;

<figure><img src="../.gitbook/assets/build-apps/module/19.png" alt=""><figcaption></figcaption></figure>

### Método

#### Adicionando um novo método

Na guia **Configurações**, clique em **+** **Adicionar** para criar um novo método de módulo. Clique no método para renomeá-lo e selecione uma ação. No exemplo a seguir, o método `limparTudo` foi projetado para limpar o conteúdo em ambas as caixas de entrada. Para conseguir isso, selecione **Executar JavaScript** como a ação e escreva o código JS para chamar o método `limparValor` de ambos os dois componentes de entrada.&#x20;

<figure><img src="../.gitbook/assets/build-apps/module/20.png" alt=""><figcaption></figcaption></figure>

{% hint style="warning" %}
Ao criar um método para um módulo, você não pode criar parâmetros de entrada para o método e só pode fazer referência a parâmetros dentro do escopo do módulo atual.
{% endhint %}

#### Chamando um método

Ao usar módulos, você pode chamar um método de módulo de duas maneiras:

- Em manipuladores de eventos, selecione **Ação** > **Componente de controle** e, em seguida, selecione **componente** e **método**.&#x20;

  <figure><img src="../.gitbook/assets/build-apps/module/21.png" alt=""><figcaption></figcaption></figure>

- Use notação de ponto em consultas JavaScript. Por exemplo, `modulo1.limparTudo()` chama o método `limparTudo()` de `modulo1`.

#### Testando o Método

Você pode simular a chamada do método de teste na função **Teste de Método**.

<figure><img src="../.gitbook/assets/build-apps/module/22.gif" alt=""><figcaption></figcaption></figure>

### Evento

Os eventos são usados ​​para transferir sinais de um módulo para aplicativos externos, como definir eventos `pedidoFeito` `pedidoModificado` para um módulo de gerenciamento de pedidos. Você pode adicionar e disparar eventos dentro de um módulo e lidar com eles usando [manipuladores de eventos](event-handlers.md) externamente.

#### Adicionar um novo evento

Na guia **Configurações**, clique em **+** **Adicionar** para criar um novo evento de módulo. Clique no evento para definir seu nome.&#x20;

<figure><img src="../.gitbook/assets/build-apps/module/23.png" alt=""><figcaption></figcaption></figure>

#### Acionando um evento

No exemplo a seguir, o evento `conteudoAlterado` é acionado quando o conteúdo de qualquer caixa de entrada é alterado. Você pode acioná-lo de duas maneiras:

- Em **Manipuladores de eventos** de ambos os componentes de entrada, clique em **+ Adicionar**, selecione **Alterar** como o evento do componente e **Disparador de evento de módulo** como a ação e, finalmente, selecione o evento do módulo ` conteudoAlterado`.&#x20;

  <figure><img src="../.gitbook/assets/build-apps/module/24.png" alt=""><figcaption></figcaption></figure>

- Use notação de ponto em consultas JavaScript: `conteudoAlterado.trigger()`.

#### Manipuladores de eventos

Quando um aplicativo usa um módulo, você pode configurar como o aplicativo atual reage aos eventos do módulo. Por exemplo, em **Manipuladores de eventos** de `modulo1`, clique em **+ Adicionar** e selecione o evento do módulo `conteudoAlterado` e a ação **Mostrar aviso**.&#x20;

<figure><img src="../.gitbook/assets/build-apps/module/25.png" alt=""><figcaption></figcaption></figure>

#### Testando Evento

O exemplo a seguir conduz testes de eventos na seção **Teste de Eventos**.&#x20;

<figure><img src="../.gitbook/assets/build-apps/module/26.gif" alt=""><figcaption></figcaption></figure>

## Permissions

Os usuários finais não recebem permissões automaticamente para visualizar módulos em aplicativos ou outros módulos com os quais tenham permissão de visualização. Por isso, você deve conceder permissão nos módulos como faz com os aplicativos. Para obter mais informações, consulte [permissões para recursos](../workspace-management/permissions-for-resources.md).

## Lançamentos e versões

PocketBlocks armazena as versões históricas de seus módulos para suas referências. Clique em **Visualizar > Publicar** no canto superior direito. O gerenciamento de lançamento de um módulo é idêntico ao de um aplicativo. Para obter informações detalhadas, consulte [gerenciamento de versões](version-and-release-management.md#release-management).

{% hint style="info" %}
Para um módulo não publicado, os aplicativos e módulos usam sua versão mais recente; enquanto para um publicado, você precisa publicá-lo novamente para sincronizar suas alterações mais recentes.
{% endhint %}
