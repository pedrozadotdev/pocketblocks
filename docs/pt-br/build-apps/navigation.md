# Navegação

**Navegação** agrega seus aplicativos na barra lateral esquerda e orienta você para encontrar rapidamente o aplicativo necessário.

<figure><img src="../.gitbook/assets/build-apps/navigation/01.png" alt=""><figcaption></figcaption></figure>

Na página inicial do PocketBlocks, clique em **Novo** e selecione **Navegação** para criar uma página de navegação.

<figure><img src="../.gitbook/assets/build-apps/navigation/02.png" alt=""><figcaption></figcaption></figure>

## Itens do menu

No editor de **Navegação**, clique em **+ Novo** para adicionar itens de menu.

<figure><img src="../.gitbook/assets/build-apps/navigation/03.png" alt=""><figcaption></figcaption></figure>

Selecione um item de menu, escolha o aplicativo para navegar e altere o rótulo e o ícone, se necessário. O aplicativo é exibido na tela em tempo real.

<figure><img src="../.gitbook/assets/build-apps/navigation/04.png" alt=""><figcaption></figcaption></figure>

### Adicionando itens de submenu

Para adicionar itens de submenu, clique em `···` > **Adicionar item de submenu** ou arraste `⋮⋮` para tornar um item de menu subordinado a outro.

<figure><img src="../.gitbook/assets/build-apps/navigation/05.png" alt=""><figcaption></figcaption></figure>

<figure><img src="../.gitbook/assets/build-apps/navigation/06.gif" alt=""><figcaption></figcaption></figure>

{% hint style="warning" %}
Um item de menu pai só pode expandir ou dobrar os itens do submenu. Você não pode vincular um aplicativo a ele.

Quando você exclui um item de menu pai, todos os itens de submenu nele são excluídos ao mesmo tempo.
{% endhint %}

<figure><img src="../.gitbook/assets/build-apps/navigation/07.png" alt=""><figcaption></figcaption></figure>

### Adicionando parâmetros de URL

Adicione parâmetros de consulta de URL ou parâmetros de hash a um item de menu com `chave` e `valor`.![](../.gitbook/assets/build-apps/navigation/08.png)

Em seguida, clique no item de menu na tela e os parâmetros serão anexados à URL do aplicativo a ser aberto. Você pode verificar na guia **Globais** no painel esquerdo.![](../.gitbook/assets/build-apps/navigation/09.png)

{% hint style="info" %}
Para referenciar os parâmetros de URL, use `{{url.query.chave1}}` ou `{{url.hash.chave1}}` em seu aplicativo.
{% endhint %}

Para obter mais informações sobre parâmetros de URL, veja Ir para app.

### Visibilidade dos itens do menu

Por padrão, um item de menu fica oculto para usuários sem permissão do aplicativo. Quando você desativa esta opção, os usuários podem ver o item de menu, mas não podem ver o aplicativo ao qual ele faz referência.![](../.gitbook/assets/build-apps/navigation/10.png)

## Permissões

As permissões para navegações são as mesmas dos módulos e aplicativos. Consulte Permissões para recursos.
