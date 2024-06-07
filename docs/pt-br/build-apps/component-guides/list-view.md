---
description: >-
  O componente Exibição em lista serve para você exibir linhas de dados. Funciona como um contêiner: você pode inserir outros componentes nele e vincular dados a esses componentes.
---

# Exibição em lista

O componente **Exibição em lista** exibe linhas de dados. Semelhante a Formulário, Modal e Drawer, também é um componente semelhante a um contêiner que pode conter outros componentes ou módulos. Para dados de exibição em lista, primeiro vincule os dados a um componente **Exibição em lista** e configure as regras de nomenclatura para os itens. Em seguida, você projeta a exibição da primeira linha arrastando e soltando os componentes, e esse layout será aplicado a todos os itens desse componente.

A seguir está uma demonstração da **Exibição em lista**, exibindo parte dos MELHORES LIVROS DE 2021 de[Goodreads](https://www.goodreads.com/choiceawards/best-books-2021):

<figure><img src="../../.gitbook/assets/build-apps/component-guides/list-view/01.gif" alt=""><figcaption></figcaption></figure>

Arraste e solte o **Exibição em lista** na tela. Cada item contém uma **Imagem**, um **Texto** e um componente de **Avaliação**. Você pode atualizar a exibição de todo o componente **Exibição em lista** configurando o layout da primeira entrada.

Clique no componente **Imagem** para ver a fonte da imagem padrão.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/list-view/02.png" alt=""><figcaption></figcaption></figure>

O componente **Exibição em lista** recupera dados de uma matriz JSON de objetos e exibe um componente **Imagem**, **Texto** e **Avaliação** para cada entrada. Você também pode passar os resultados da consulta para uma **Exibição em lista**.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/list-view/03.png" alt=""><figcaption></figcaption></figure>

## Vinculando dados

Os dados de um componente **Exibição em lista** aceitam dois tipos de valores: número e matriz.

- Número: os números são processados ​​como contagem de linhas e nenhum dado válido é passado para o componente **Exibição em lista**.
- Array: O comprimento de um array é passado como contagem de linhas e cada entrada no array é processada como um objeto JS no formato JSON, correspondendo a uma linha no componente **Exibição em lista**. Por exemplo, os dados a seguir contêm duas linhas de dados, cada uma contendo quatro campos: `avaliacao`, `titulo`, `url` e `cover`.&#x20;

```json
[
  {
    "avaliacao": "9.2",
    "titulo": "The Shawshank Redemption",
    "url": "https://www.imdb.com/title/tt0111161/",
    "cover": "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_UY67_CR0,0,45,67_AL_.jpg"
  },
  {
    "avaliacao": "9.2",
    "titulo": "The Godfather",
    "url": "https://www.imdb.com/title/tt0068646/",
    "cover": "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_UY67_CR1,0,45,67_AL_.jpg"
  }
]
```

Você pode visualizar os dados detalhados sobre o componente **Exibição em lista**, seus itens, propriedades, etc., no navegador de dados.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/list-view/04.png" alt=""><figcaption></figcaption></figure>

<figure><img src="../../.gitbook/assets/build-apps/component-guides/list-view/05.png" alt=""><figcaption></figcaption></figure>

## Exibir dados em componentes internos

Depois de vincular dados válidos ao componente **Exibição em lista** e projetar seus componentes internos, você pode adicionar dados a esses componentes. **Exibição em lista** suporta variáveis ​​locais `currentItem` e `i`. Observe que você só precisa alterar os dados da primeira linha, e as mesmas configurações são aplicadas às outras linhas automaticamente.

{% hint style="info" %}
Você pode vincular um endereço URL estático ao componente **Imagem** para exibição de imagens; e como esse endereço URL é estático, a mesma imagem aparece em todas as linhas.
{% endhint %}

<figure><img src="../../.gitbook/assets/build-apps/component-guides/list-view/06.png" alt=""><figcaption></figcaption></figure>

## Nomeando os itens

Você pode definir os nomes dos índices dos itens e os nomes dos dados dos itens. Isto é útil ao incorporar uma lista em outra lista. Por exemplo, você pode definir o índice de uma lista como `i` e o aninhado interno `j` para evitar conflito de nomenclatura.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/list-view/07.png" alt=""><figcaption></figcaption></figure>

### Nome do índice do item

Por padrão, o índice do item é denominado `i`, referindo-se ao índice dos dados da lista e começando do zero. Além de usar `i` como números, você também pode usar `i` para acessar dinamicamente os dados dos resultados da consulta.

Por exemplo, para acessar o campo `nome_do_livro` da tabela `ficcao` no componente **Texto**, escreva o seguinte código.

```javascript
{
  {
    getAllFictions.data[i].nome_do_livro;
  }
}
```

Em seguida, você poderá ver os nomes dos livros de ficção exibidos no **Exibição em lista** por ordem de índice.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/list-view/08.png" alt=""><figcaption></figcaption></figure>

### Nome dos dados do item

Por padrão, você pode referenciar o valor de cada item em uma lista usando a variável `currentItem`. Por exemplo, para exibir um número de série mais o nome do livro, escreva o seguinte código no valor `texto1`.

```javascript
{{i+1}}. {{currentItem.nome_do_livro}}
```

<figure><img src="../../.gitbook/assets/build-apps/component-guides/list-view/09.png" alt=""><figcaption></figcaption></figure>

{% hint style="info" %}
Erros de dependência circular ocorrem quando você faz referência aos dados de uma linha por `listView.items[i]` de um componente dentro de um componente **Exibição em lista**. Recomenda-se usar tal referência somente fora da lista.
{% endhint %}

## Paginação

### Pulo rápido

Alterne "Mostrar pulo rápido" ou defina seu valor como `true` para permitir que seus usuários acessem rapidamente a página especificada.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/list-view/10.png" alt=""><figcaption></figcaption></figure>

### Tamanho da página

Você pode configurar se deseja permitir que seus usuários personalizem quantos itens serão exibidos em uma única página ativando ou desativando o "Mostrar botão de alteração de tamanho" ou definindo seu valor em JS. Quando desativado, você pode definir o tamanho de página padrão.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/list-view/11.png" alt=""><figcaption></figcaption></figure>

Se ativado, você poderá configurar vários tamanhos de página para serem selecionados pelos usuários.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/list-view/12.png" alt=""><figcaption></figcaption></figure>

### Contagem total de linhas

Por padrão, a contagem total de linhas de um componente **Exibição em lista** é o número de itens de dados atuais. Você também pode inserir um valor de uma consulta. Por exemplo, `{{consulta1.data[0].countador}}`.

## Referenciar itens fora da lista

**Exibição em lista** oferece suporte à exposição de dados de componentes internos com o campo **Itens**. Você pode inspecionar o **Navegador de dados** no painel esquerdo.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/list-view/13.png" alt=""><figcaption></figcaption></figure>

Por exemplo, arraste um componente **Entrada de Texto** para **Exibição em lista** e, em seguida, você poderá referenciar o valor do componente **Avaliação** em componentes fora do **Exibição em lista** pelo código a seguir.

```javascript
{
  {
    listView1.items[0].rating1.value;
  }
}
```

<figure><img src="./../.gitbook/assets/build-apps/component-guides/list-view/14.png" alt=""><figcaption></figcaption></figure>
