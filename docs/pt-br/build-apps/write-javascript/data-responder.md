# Respondedor de dados

Ao construir um aplicativo, você pode definir eventos para os componentes para ouvir as alterações de determinados dados. Por exemplo, para um componente **Tabela**, os eventos integrados para a alteração da propriedade `selectedRow` incluem "Alteração de seleção de linha", "Alteração de filtro", "Alteração de classificação" e "Alteração de página".

No entanto, faltam eventos semelhantes para algumas alterações de dados, como alterações de estados temporários, transformadores ou resultados de consultas. Os respondedores de dados são projetados para esses casos e permitem ouvir e responder a qualquer alteração nos dados.

{% hint style="info" %}
Os eventos para respondedores de dados são mais gerais do que os eventos que escutam alterações de dados, como alteração de conteúdo, alteração de seleção de linha, etc.
{% endhint %}

## Ouça as alterações de dados

No editor de consultas, clique em **+ Novo** e selecione **Respondedor de dados** para criar um novo respondedor de dados.

<figure><img src="../../.gitbook/assets/build-apps/write-javascript/data-responder/01.png" alt=""><figcaption></figcaption></figure>

Você pode definir os dados que o respondedor de dados escuta. Ele suporta todos os tipos de formatos de dados, incluindo número, string, array e objeto JS. No exemplo a seguir, qualquer alteração de valor no componente **Texto** aciona uma notificação global.

<figure><img src="../../.gitbook/assets/build-apps/write-javascript/data-responder/02.png" alt=""><figcaption></figcaption></figure>

Se os dados estiverem em formato de array ou objeto JS, a alteração dos dados de qualquer subelemento acionará o evento configurado. Por exemplo, os dados de `dataResponder2` são um objeto JS, que escuta dois componentes **Entrada de Texto** no aplicativo. A alteração de dados de qualquer componente aciona a mesma notificação global.

<figure><img src="../../.gitbook/assets/build-apps/write-javascript/data-responder/03.png" alt=""><figcaption></figcaption></figure>

## Respondendo ações

Para obter informações detalhadas, vá para [Manipuladores de eventos](../event-handlers.md) > [Ações](../event-handlers.md#actions).
