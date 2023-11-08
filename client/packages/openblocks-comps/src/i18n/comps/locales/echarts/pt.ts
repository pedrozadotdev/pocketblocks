/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * Language: English.
 */

export const pt = {
  time: {
    month: [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ],
    monthAbbr: [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ],
    dayOfWeek: [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
    ],
    dayOfWeekAbbr: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  },
  legend: { selector: { all: "Todos", inverse: "Inverso" } },
  toolbox: {
    brush: {
      title: {
        rect: "Caixa de seleção",
        polygon: "Selecionar Lasso",
        lineX: "Selecione horizontalmente",
        lineY: "Selecione verticalmente",
        keep: "Mantenha seleções",
        clear: "Limpar seleções",
      },
    },
    dataView: {
      title: "Visualização de dados",
      lang: ["Visualização de dados", "Fechar", "Atualizar"],
    },
    dataZoom: { title: { zoom: "Zoom", back: "Reset de zoom" } },
    magicType: {
      title: {
        line: "Mudar para gráfico de linha",
        bar: "Mudar para gráfico de barras",
        stack: "Stack",
        tiled: "Telha",
      },
    },
    restore: { title: "Restaurar" },
    saveAsImage: {
      title: "Salvar como imagem",
      lang: ["Clique com o direito para salvar a imagem"],
    },
  },
  series: {
    typeNames: {
      pie: "Gráfico de pizza",
      bar: "Gráfico de barras",
      line: "Gráfico de linha",
      scatter: "Enredo de dispersão",
      effectScatter: "Lote de dispersão",
      radar: "Gráfico de radar",
      tree: "Árvore",
      treemap: "Um mapa de árvores",
      boxplot: "Papel de caixa",
      candlestick: "Punho de vela",
      k: "Gráfico de linha K",
      heatmap: "Mapa do calor",
      map: "Mapa",
      parallel: "Mapa da coordenada paralela",
      lines: "Gráfico de linha",
      graph: "Gráfico de relacionamento",
      sankey: "Diagrama de Sankey",
      funnel: "Gráfico de Funil",
      gauge: "Calibre",
      pictorialBar: "Barra de pictórica",
      themeRiver: "Mapa do Rio Tema",
      sunburst: "Sunburst",
    },
  },
  aria: {
    general: {
      withTitle: 'Este é um gráfico sobre "{title}"',
      withoutTitle: "Este é um gráfico",
    },
    series: {
      single: {
        prefix: "- ..",
        withName: "com tipo {seriesType} nomeado {seriesName}.",
        withoutName: "com tipo {seriesType}.",
      },
      multiple: {
        prefix: ". Consiste na contagem de séries {seriesCount}.",
        withName:
          "A série {seriesId} é uma {seriesType} representando {seriesName}.",
        withoutName: "A série {seriesId} é uma {seriesType}.",
        separator: { middle: "- ..", end: "- .." },
      },
    },
    data: {
      allData: "Os dados são os seguintes:",
      partialData: "Os primeiros itens são:",
      withName: "os dados para {name} é {value}",
      withoutName: "Não",
      separator: { middle: ",", end: "." },
    },
  },
};
