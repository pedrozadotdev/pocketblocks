# Gráficos

Tabelas e gráficos são representações visuais de dados usados ​​para simplificar informações complexas e torná-las mais fáceis de entender. Eles podem ajudar a destacar insights importantes e fornecer um resumo rápido de dados que, de outra forma, seriam difíceis de interpretar. Os gráficos vêm em diferentes formatos, como gráficos de barras, gráficos de linhas, gráficos de pizza, gráficos de dispersão e muito mais, cada um adequado para diferentes tipos de dados e finalidades analíticas.

PocketBlocks permite inserir vários formatos de tabelas e gráficos em seus aplicativos para satisfazer suas necessidades em diferentes casos de uso.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/charts-and-graphs/01.gif" alt=""><figcaption></figcaption></figure>

## Modo UI

### Formato de dados

No modo UI, o componente **Gráfico** oferece suporte à apresentação de dados armazenados como uma matriz de objetos JS. Cada campo de objeto corresponde a uma coluna em formato tabular. Os objetos na matriz a seguir contêm três campos: `data`, `fruta` e `contador`.

```json
[
  { "data": "2022-03-01", "fruta": "apple", "contador": 4 },
  { "data": "2022-03-01", "fruta": "banana", "contador": 6 },
  { "data": "2022-04-01", "fruta": "grape", "contador": 10 },
  { "data": "2022-04-01", "fruta": "apple", "contador": 3 },
  { "data": "2022-04-01", "fruta": "banana", "contador": 2 }
]
```

Você também pode usar o código JS em `{{}}` para fazer referência a dados de outros componentes ou consultas ou para transformar dados para atender a necessidades específicas.

Por exemplo, o resultado da consulta `colsulta1` é o seguinte.

```json
{
  "data": [
    "2022-03-01",
    "2022-03-01",
    "2022-04-01",
    "2022-04-01",
    "2022-04-01"
  ],
  "fruta": ["apple", "banana", "grape", "apple", "banana"],
  "contador": [4, 6, 10, 3, 2]
}
```

Você pode transformá-lo usando o transformador `transformador1` com o seguinte código JS.

```javascript
let datas = query1.data.data;
let frutas = query1.data.fruta;
let contadores = query1.data.contador;
let resultado = [];
for (let i = 0; i < datas.length; i++) {
  resultado.push({ date: datas[i], fruta: frutas[i], count: contadores[i] });
}
return resultado;
```

Em seguida, referencie o valor do transformador `{{transformador1.value}}` como dados para o gráfico.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/charts-and-graphs/02.png" alt=""><figcaption></figcaption></figure>

### Tipo de Gráfico

PocketBlocks oferece suporte a quatro tipos de gráficos: gráfico de barras, gráfico de linhas, gráfico de dispersão e gráfico de pizza. Você pode selecionar o tipo de gráfico em **Propriedades** > **Dados** > **Tipo de gráfico**. Você também pode personalizar o layout e o estilo do seu gráfico na guia **Propriedades**.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/charts-and-graphs/03.png" alt=""><figcaption></figcaption></figure>

### Eixo X

Gráficos de barras, gráficos de linhas e gráficos de pizza mapeiam valores para variáveis ​​categóricas. Assim, nesses gráficos, o eixo X geralmente mostra dados não numéricos – por exemplo, data ou departamento.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/charts-and-graphs/04.png" alt=""><figcaption></figcaption></figure>

Por padrão, o PocketBlocks detecta automaticamente os dados do eixo X e seu tipo. Você também pode selecionar manualmente um entre "Eixo de categoria", "Eixo de valor", "Eixo de tempo" ou "Eixo de registro". Para obter informações detalhadas, consulte [tipo de eixo X](https://echarts.apache.org/en/option.html#xAxis.type).

<figure><img src="../../.gitbook/assets/build-apps/component-guides/charts-and-graphs/05.png" alt=""><figcaption></figcaption></figure>

### Série de gráficos

Na maioria dos tipos de gráficos, a **Série de gráficos** (eixo Y) apresenta valores numéricos para as categorias no eixo X. Por padrão, PocketBlocks preenche todos os campos numéricos no eixo Y. Você pode ocultar campos desnecessários em **Propriedades** > **Série de gráficos**.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/charts-and-graphs/06.png" alt=""><figcaption></figcaption></figure>

## Echarts em JSON

Além dos gráficos integrados, você também pode plotar seus dados com o [Apache ECharts](https://echarts.apache.org/en/index.html), uma biblioteca de visualização JS de código aberto. Você só precisa preencher o campo **Configuração** > **Opção** no formato JSON. Para informações detalhadas, consulte a [documentação do ECharts](https://echarts.apache.org/en/option.html#title) e os [exemplos do ECharts](https://echarts.apache.org/examples/en/index.html).

<figure><img src="../../.gitbook/assets/build-apps/component-guides/charts-and-graphs/07.png" alt=""><figcaption></figcaption></figure>

Se precisar de mais opções de configuração para gráficos, crie uma issue no [Github](https://github.com/internoapp/pocketblocks/issues).
