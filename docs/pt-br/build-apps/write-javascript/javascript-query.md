# Consulta JavaScript

Há casos em que você deseja orquestrar operações, por exemplo, após acionar duas consultas, deseja combinar e armazenar seus resultados em um estado temporário e, em seguida, abrir um modal. Este processo pode ser complicado ao encadear vários manipuladores de eventos e certamente não pode ser feito em uma linha de código em `{{ }}`. É aí que entra a consulta JavaScript (JS). Ela libera a capacidade de interagir com componentes e consultas escrevendo consultas JS complexas para realizar as seguintes operações:

- Interagir com componentes da UI
- Acionar consultas
- Acessar bibliotecas JS de terceiros
- Personalizar funções

O exemplo a seguir é para você entender rapidamente o que é consulta JS e como ela funciona.

## Retorna dados

Use a sintaxe `return` para retornar o resultado. Por exemplo, o código a seguir retorna `3`.

```javascript
return Math.floor(3.4);
```

O resultado retornado também pode ser um objeto [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). Por exemplo, `query2.run()` retorna um objecto promise.

```javascript
return query2.run();
```

{% hint style="info" %}
A instrução `return` não é necessária para cenários onde você deseja omitir resultados.
{% endhint %}

## Acessando dados

Use consultas JS para acessar dados em seu aplicativo. Observe que não há necessidade de usar a notação `{{ }}`.

```javascript
var data = [input1.value, query1.data, fileUpload.files[0].name];
```

## Controlando Componentes

Em consultas JS, você pode usar métodos expostos por componentes para interagir com componentes de UI em seu aplicativo. Tal operação não é suportada pelo código JS embutido em `{{}}`.

```javascript
// defina o valor de input1 como "Olá"
input1.setValue("Olá");
```

{% hint style="warning" %}
O método `input1.setValue()` (ou outros métodos componentes) é assíncrono e retorna um objeto [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). Acessando `input1.value` imediatamente após definir o valor de `input1` não retorna o valor atualizado.
{% endhint %}

## Executando consulta

### `run()` método e retornos de chamada

Execute o método `run()` para executar outras consultas, por exemplo:

```javascript
return consultaPorNome.run(); // execute uma consulta e ela retornará uma Promise
```

O valor de retorno de `query.run()` é uma promise, então você pode anexar retornos de chamada para lidar com o resultado ou erro bem-sucedido.

```javascript
return consultaPorNome.run().then(
  (data) => {
    // após a consulta ser executada com sucesso
    return "olá, " + data.user_fullname;
  },
  (error) => {
    // após a consulta ser executada com falha
    // use a função de mensagem integrada para exibir uma mensagem de erro
    message.error("Ocorreu um erro ao buscar o usuário: " + error.message);
  }
);
```

### Passando parâmetros

Você pode passar parâmetros no método `run()` para dissociar a implementação da consulta de seus parâmetros.

```javascript
query.run({
    parametro1: valor1,
    parametro2: valor2,
    ...
});
```

## Declarando uma função

Você pode declarar funções dentro de uma consulta JS para melhor legibilidade.

```javascript
// Se o primeiro número é um múltiplo do segundo número
function eMultiplo(num1, num2) {
  return num1 % num2 === 0;
}

// Chame a biblioteca do moment para retornar a data atual
function dataAtual() {
  return moment().format("DD/MM/YYYY");
}
```

## Adicionando scripts pré-carregados

PocketBlocks oferece suporte à importação de bibliotecas JS de terceiros e à adição de código JS predefinido, como a adição de métodos ou variáveis ​​globais para reutilização em **nível de aplicativo** ou **nível de espaço de trabalho**. Você pode encontrar as configurações no nível do aplicativo em ⚙️ > **Outros** > **Scripts e estilo**.

<figure><img src="../../.gitbook/assets/build-apps/write-javascript/javascript-query/01.png" alt=""><figcaption></figcaption></figure>

Para nível de espaço de trabalho, acesse ⚙️ **Configurações** > **Avançado**.

<figure><img src="../../.gitbook/assets/build-apps/write-javascript/javascript-query/02.png" alt=""><figcaption></figcaption></figure>

Na guia **JavaScript**, você pode adicionar código JavaScript pré-carregado para definir métodos e variáveis ​​globais e reutilizá-los em seu aplicativo. Para importar bibliotecas, consulte [Usando biblioteca de terceiros](../use-third-party-libraries.md).

<figure><img src="../../.gitbook/assets/build-apps/write-javascript/javascript-query/03.png" alt=""><figcaption></figcaption></figure>

<figure><img src="../../.gitbook/assets/build-apps/write-javascript/javascript-query/04.png" alt=""><figcaption></figcaption></figure>

## &#x20;Restrições

Por motivos de segurança, diversas variáveis ​​globais e funções de **window** estão desabilitadas no PocketBlocks. Por favor, reporte ao nosso [GitHub](https://github.com/internoapp/pocketblocks) se você encontrar algum problema.
