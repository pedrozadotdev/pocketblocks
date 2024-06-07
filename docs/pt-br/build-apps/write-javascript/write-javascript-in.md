# Escreva JavaScript em \{{ \}}

Ao construir aplicativos no PocketBlocks, você pode usar JavaScript (JS) para acessar e transformar dados de objetos, incluindo componentes, consultas e parâmetros globais. Ao escrever JavaScript dentro da caixa de entrada da propriedade do componente, configurações de coluna da tabela, etc., lembre-se sempre de colocar todo o seu código JS entre chaves duplas, como `{{'olá, ' + usuarioAtual.nome}}`.

## Acessando dados

Os objetos têm nomes globalmente exclusivos, como `entrada1`, `consulta1` e `tabela1`. Você pode consultar as propriedades dos objetos em seu aplicativo por código JS.

### Acessando dados em um objeto

PocketBlocks oferece suporte para acessar os dados em um objeto usando notação de ponto (`nomeDoObjecto.nomeDaChave`). Por exemplo, `{{informacoesDoUsuario.selectedRow.nome}}` acessa o valor `nome` na linha atualmente selecionada da **Tabela** `informacoesDoUsuario`.

Ao escrever JS em `{{ }}` para acessar valores em um objeto, adicione um `.` após o nome do objeto para acionar um menu de sugestão automática caso você não tenha certeza sobre as propriedades ou métodos integrados dos objetos.

**Exemplo**

Este GIF mostra como a notação de ponto aciona um menu de sugestão automática e exibe as propriedades de `tabela1`.

<figure><img src="../../.gitbook/assets/build-apps/write-javascript/write-javascript-in/01.gif" alt=""><figcaption></figcaption></figure>

### Acessando dados em um array

Você pode acessar os valores em um array por índice. O índice sempre começa em 0, então você pode usar `array[0]` para acessar o primeiro elemento do array.

**Exemplo**

A propriedade **Data** do componente **Tabela** é uma matriz de objetos. Este GIF mostra como acessar o valor de `primeiro_nome` no primeiro elemento do array **data** em `tabela1`.

<figure><img src="../../.gitbook/assets/build-apps/write-javascript/write-javascript-in/02.gif" alt=""><figcaption></figcaption></figure>

## Transformando dados

Você pode aproveitar funções JS integradas e bibliotecas de terceiros em `{{ }}` para transformar dados, como operações `filter()`, `map()` e `reduce()`.

**Exemplos**

Colocando texto em caixa baixa.

```javascript
{
  {
    entrada1.value.toLowerCase();
  }
}
```

Alterar formato de data

```javascript
{
  {
    moment(tabela1.selectedRow.coluna).format("DD/MM/YYYY");
  }
}
```

Retornar o nome dos resultados da consulta.

```javascript
{{consulta1.data.map(i => i.nome)}}.
```

## Restrições

O código JS em `{{ }}` deve ser um código de linha única, como `.map()` ou `.reduce()` combinado com uma função de seta ou um operador ternário.

**Exemplos**

```javascript
{
  {
    consulta1.data.id.length;
  }
} // ✅ para referenciar um valor
{
  {
    consulta1.data.map((linha) => linha.id);
  }
} // ✅ .map() + função arrow
{
  {
    num1 > num2 ? num1 : num2;
  }
} // ✅ ternário
```

Os seguintes exemplos de código JS são ilegais em `{{ }}`.

```javascript
{
  {
    // ❌ você não pode escrever código como este em {{ }}
    const lista = consulta1.data;
    const listaFiltrada = lista.filter((isso) => isso.valor > 10);
    return listaFiltrada;
  }
}
```

Se você deseja orquestrar múltiplas linhas de JavaScript, PocketBlocks oferece suporte para escrever esse código em [transformadores](transformers.md).

```javascript
// códigos dentro de um transformador
if (seletor.value === "1") {
  return "Opção 1";
}
if (seletor.value === "2") {
  return "Opção 2";
}
return "Opção 3";
```

## Ver dados

Os dados das consultas podem ser complicados e aninhados em casos reais. A visualização de dados fornece a estrutura detalhada dos dados em objetos e ajuda a entendê-los melhor. Antes de acessar ou transformar dados, pode ser necessário primeiro visualizar os dados e sua estrutura. PocketBlocks oferece três maneiras de visualizar dados.

### Ver resultado da consulta

Depois de executar uma consulta dentro do editor de consultas, clique no botão **Executar**. O resultado da consulta é exibido no formato mostrado abaixo.

<figure><img src="../../.gitbook/assets/build-apps/write-javascript/write-javascript-in/03.png" alt=""><figcaption></figcaption></figure>

### Visualizando dados no navegador de dados

O navegador de dados localizado no painel esquerdo exibe todos os dados dentro do seu aplicativo. Você pode clicar no nó para expandir e visualizar a estrutura de dados.

<figure><img src="../../.gitbook/assets/build-apps/write-javascript/write-javascript-in/04.png" alt=""><figcaption></figcaption></figure>

### Visualizando em tempo real

Ao configurar propriedades ou escrever código JS dentro de um editor, você pode visualizar o resultado avaliado em tempo real em uma caixa abaixo do seu editor.

<figure><img src="../../.gitbook/assets/build-apps/write-javascript/write-javascript-in/05.png" alt=""><figcaption></figcaption></figure>
