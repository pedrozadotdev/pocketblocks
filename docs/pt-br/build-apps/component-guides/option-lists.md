# Listas de opções

Um menu suspenso garante uma entrada fácil e sem erros do usuário, oferecendo uma lista de opções possíveis. PocketBlocks suporta a implementação de listas de opções usando componentes como **Seletor** e **Seletor Mútiplo**. Você pode configurar uma lista de opções manualmente ou mapeando dados de suas fontes de dados.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/option-lists/01.png" alt=""><figcaption></figcaption></figure>

## Propriedades

Cada lista de opções possui quatro propriedades.

- **Rótulo**: o texto da opção exibido aos usuários
- **Valor**: o identificador exclusivo da opção
- **Desativado**: desativa a opção (o valor padrão é `false`)
- **Oculto**: oculta a opção (o valor padrão é `false`)

<figure><img src="../../.gitbook/assets/build-apps/component-guides/option-lists/02.png" alt=""><figcaption></figcaption></figure>

{% hint style="warning" %}
Quando mais de uma opção em uma lista utiliza o mesmo valor, apenas a primeira opção é válida e, portanto, exibida.
{% endhint %}

## Modo manual

Em **Básico** > **Manual**, clique em **+ Adicionar** para criar uma nova opção. Selecione uma opção para configurá-lo manualmente. Você pode clicar em `···` para **Duplicar** ou **Excluir** uma opção e arrastar `⋮⋮` para organizar sua posição.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/option-lists/03.png" alt=""><figcaption></figcaption></figure>

Verifique o valor da opção selecionada em **Componentes** no navegador de dados. Por exemplo, quando **Nova York** é selecionado, você pode encontrar o valor da string `"1"` para **localizacaoSelecionada**.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/option-lists/04.png" alt=""><figcaption></figcaption></figure>

O modo manual é recomendado para estes cenários:

- Gerenciável e enumerável manualmente.
- Usado por apenas um componente.
- Os dados não vêm de fontes de dados.

## Modo mapeado

Quando você tiver dados da lista de opções provenientes de fontes de dados, transformadores ou estado temporário, poderá usar o **Modo Mapeado**. Em **Básico** > **Mapeado**, insira sua matriz de fonte de dados na caixa **Dados** usando código JavaScript (JS). Uma lista de opções será mapeada automaticamente a partir deste array. Por exemplo, acesse informações da universidade via `{{universidade.dado}}`. Cada item na matriz de resultados contém `pais`, `paginas_web`, `codigo` e `nome`.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/option-lists/05.png" alt=""><figcaption></figcaption></figure>

Você pode referenciar o valor de qualquer campo de uma opção através de `item` e seu índice `i`, começando em 0. No exemplo a seguir, o **Rótulo** de cada opção é o `nome` da universidade, o **Valor** é `web_page`, e aqueles que contêm um parêntese de abertura `(` em seus nomes estão desativados. O valor padrão é definido como `paginas_web` do primeiro item usando `{{universidade.dado[0] .paginas_web}}`. Observe que o valor padrão de uma lista de opções deve ser um elemento do array **Valor**, mas não do array **Rótulo**.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/option-lists/06.png" alt=""><figcaption></figcaption></figure>

Verifique o valor da opção selecionada em **Componentes** no navegador de dados. Por exemplo, quando "Ahi Evran University" é selecionado, seu valor de string `[\"http://www.ahievran.edu.tr/\"]` é exibido.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/option-lists/07.png" alt=""><figcaption></figcaption></figure>
