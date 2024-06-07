# Estado temporário

Você pode usar o estado temporário para armazenar e fazer referência a dados locais em um aplicativo. Cada vez que você carrega ou atualiza um aplicativo, o valor do estado temporário é redefinido.

## Cenários de casos de uso

Os estados temporários podem ajudar nos seguintes cenários:

- Para rastrear os valores temporários de uma variável quando o usuário interage com seu aplicativo.
- Para armazenar seus dados apenas em operação sem persistir em um banco de dados.
- Para funcionar como uma propriedade temporária quando propriedades integradas no PocketBlocks (como `{{tabela.selectedRow}}` e `{{seletor.value}}`) não suportam seu caso de uso.
  {% hint style="info" %}
  Para armazenar e acessar dados em aplicativos no seu espaço de trabalho, use o localStorage.
  {% endhint %}

## Crie um estado temporário

Clique em **+ Novo** e selecione **Estado temporário** no editor de consultas.

<figure><img src="../../.gitbook/assets/build-apps/write-javascript/temporary-state/01.png" alt=""><figcaption></figcaption></figure>

Você pode renomear o estado temporário e definir um valor inicial.

<figure><img src="../../.gitbook/assets/build-apps/write-javascript/temporary-state/02.png" alt=""><figcaption></figcaption></figure>

## Definindo valores de estado

O estado temporário oferece métodos `setValue()` e `setIn()` para definir ou alterar seu valor, que podem ser chamados em consultas JavaScript.

Use `setValue()` para alterar o valor diretamente.

```javascript
//state.setValue(value: any)
state.setValue(3);
state.setValue(input1.value);
```

Quando o valor inicial de um estado temporário é um objeto, use `setIn()` para alterar o valor em um caminho especificado.

```javascript
// valor inicial de estado2 da seguinte forma:
{
    garota: {
        nome: "Lucia",
        idade: 18,
        cidade: {
            nome: "Nova Iorque"
        }
     }
     garoto: {
         nome: "Bob",
         idade: 21,
         cidade: {
             nome: "Los Angeles"
         }
     }
}
//Para alterar o valor em um caminho especificado
//estado.setIn(caminho, qualquerValor)
//caminho: uma matriz de chaves ou índices. Somente o último item do caminho será alterado.
estado2.setIn(['garota','cidade'],{nome:'Seatle'})
estado2.setIn(['garoto','idade'],18)


// Para definir o valor da matriz de valor, você pode usar
// valor inicial = ["olá", "mundo"]
estado2.setIn([1],"fulano") // isso resultará em ["olá", "fulano"]
```

Você também pode chamar esses dois métodos em [manipuladores de eventos](../event-handlers.md). Selecione **Definir estado temporário** como ação e escolha o método sob demanda.

<figure><img src="../../.gitbook/assets/build-apps/write-javascript/temporary-state/03.png" alt=""><figcaption></figcaption></figure>

## Exemplo: Incremento de um contador

Neste exemplo, o contador rastreia o número de cliques no botão. Cada vez que o usuário clica no botão, o número no componente de texto aumenta em um.

<figure><img src="../../.gitbook/assets/build-apps/write-javascript/temporary-state/04.png" alt=""><figcaption></figcaption></figure>

Crie um contador de incremento nas seguintes etapas:

1. Adicione um componente de botão `botao1` e um componente de texto `texto1`.
2. Crie um estado temporário `estado1`, defina seu valor inicial como `0`. Vincule `{{estado1.value}}` como o texto de exibição de `texto1`.

   <figure><img src="../../.gitbook/assets/build-apps/write-javascript/temporary-state/05.png" alt=""><figcaption></figcaption></figure>

3. Adicione um manipulador de eventos para `botao1`. Selecione a ação **Definir estado temporário** e o método **setValue**, e então defina `{{estado1.value+1}}` como o valor.

   <figure><img src="../../.gitbook/assets/build-apps/write-javascript/temporary-state/06.png" alt=""><figcaption></figcaption></figure>

4. Clique no botão, você pode ver que o valor de `texto1` aumenta em um cada vez que você clica.

   <figure><img src="../../.gitbook/assets/build-apps/write-javascript/temporary-state/07.png" alt=""><figcaption></figcaption></figure>

Você também pode obter o mesmo resultado usando consultas JavaScript:

1. Adicione uma nova consulta e selecione **Executar código JavaScript**.
2. Escreva a consulta JavaScript com este código e configure-a para ser invocada manualmente:\
   `estado1.setValue(estado1.value + 1)`
3. Adicione um manipulador de eventos `botao1` para executar `consulta1`.

   <figure><img src="../../.gitbook/assets/build-apps/write-javascript/temporary-state/08.png" alt=""><figcaption></figcaption></figure>

Agora clique no botão **Incrementar contador**, você deverá ver o mesmo resultado acima.
