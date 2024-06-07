# Transformadores

Os transformadores são projetados para transformação de dados e reutilização de seu código JavaScript multilinha. Os dados de consultas ou componentes podem não atender às suas necessidades em cenários de negócios. Além disso, você pode usar o mesmo bloco de código várias vezes em um aplicativo. Nesses casos, um transformador é o que você precisa.

Comparado com o código embutido em `{{ }}`, o transformador suporta blocos de código multilinha. E, diferentemente da consulta JavaScript, o transformador foi projetado para realizar operações somente leitura, o que significa que você não pode acionar uma consulta ou atualizar um estado temporário dentro de um transformador.

## Começando

Clique em **+ Novo > Transfromer** em um editor de consultas para criar um transformador.

<figure><img src="../../.gitbook/assets/build-apps/write-javascript/transformers/01.png" alt=""><figcaption></figcaption></figure>

Em seguida, escreva seu código JS no transformador. Você pode clicar em **Visualizar** para obter o valor de retorno e acessá-lo por `nomeDoTransformador.value` em seu aplicativo.

No exemplo a seguir, `transformador1` usa os dados de classificação por estrelas em `avaliacao1` para calcular uma pontuação.

<figure><img src="../../.gitbook/assets/build-apps/write-javascript/transformers/02.png" alt=""><figcaption></figcaption></figure>

{% hint style="warning" %}
`{{ }}` não é permitido dentro de um transformador ou consulta JS. `{{ }}` é usado apenas para fins de expressão JS de linha única, enquanto um transformador ou consulta JS é para múltiplas linhas de código JS.
{% endhint %}

## Casos de uso

### Transformação de data e hora

Use o método `moment().format()` para transformar formatos de data/hora. O exemplo a seguir converte o valor de data/hora de `tempo_inicial` retornado por `consulta1` para o formato `DD/MM/YYYY`.

```javascript
return consulta1.data.map((isso) => {
  return {
    ...isso,
    tempo_inicial: moment(it.tempo_inicial).format("DD/MM/YYYY"),
  };
});
```

### Classificando dados da consulta

Use o método `_.orderBy()` fornecido por [lodash](https://lodash.com/) para classificar os dados. O exemplo a seguir retorna `consulta1.data` classificado pela coluna `quantidade` em ordem crescente.

```javascript
return _.orderBy(consulta1.data, "quantidade", "asc");
```

### Juntando duas consultas

O código de exemplo abaixo mostra como unir os resultados da consulta de `usuarios` e `pedidos` usando o ID do usuário.

```javascript
const usuarios = consultarUsuarios.data;
const pedidos = consultarPedidos.data;
return usuarios.map((usuario) => ({
  ...usuario,
  pedidos: pedidos.find((pedido) => pedido.clienteId === usuario.id),
}));
```

## Operações somente leitura

Somente operações somente leitura são permitidas dentro de um transformador. Isso significa que você não pode definir valores de componentes ou estados temporários, nem acionar consultas. Para essas operações, use consultas JavaScript.

Por exemplo, você não pode chamar o método `setText()` de um componente de texto em um transformador.

<figure><img src="../../.gitbook/assets/build-apps/write-javascript/transformers/03.png" alt=""><figcaption></figcaption></figure>

Em vez disso, chame o método `setText()` em uma consulta JavaScript não reporta nenhum erro.

<figure><img src="../../.gitbook/assets/build-apps/write-javascript/transformers/04.png" alt=""><figcaption></figcaption></figure>

Em outro exemplo, o transformer`ordernador1` visa classificar os dados de `consultarUsuarios` por `primeiro_nome`, mas o método `sort()` pode alterar os dados originais, então ocorre um erro.

<figure><img src="../../.gitbook/assets/build-apps/write-javascript/transformers/05.png" alt=""><figcaption></figcaption></figure>

Neste caso, use o método `_.orderBy()` fornecido por [lodash](https://lodash.com/).

<figure><img src="../../.gitbook/assets/build-apps/write-javascript/transformers/06.png" alt=""><figcaption></figcaption></figure>
