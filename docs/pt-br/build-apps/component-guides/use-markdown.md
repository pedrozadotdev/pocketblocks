# Usar Markdown

PocketBlocks oferece suporte ao uso da linguagem de marcação leve Markdown para formatar textos em seu aplicativo, como alterar o tamanho da fonte, inserir código e adicionar uma lista. Você também pode incorporar texto formatado em HTML no Markdown para obter mais opções de estilo.

Use Markdown nos componentes **Texto** e **Tabela**.

- **Texto**: Use Markdown para o texto de entrada.

  <figure><img src="../../.gitbook/assets/build-apps/component-guides/use-markdown/01.png" alt=""><figcaption></figcaption></figure>

- **Tabela**: Use Markdown para tipo de coluna.

  <figure><img src="../../.gitbook/assets/build-apps/component-guides/use-markdown/02.png" alt=""><figcaption></figcaption></figure>

## Noções básicas de Markdown

Toda a sintaxe Markdown é válida no PocketBlocks.

- **Títulos**: Use hashtag (#) antes do título. Mais hashtags, nível de título mais baixo.
- **Parágrafos**: use uma linha em branco para separar os textos em parágrafos.
- **Quebras de linha**: adicione pelo menos dois espaços em branco no final de uma linha e pressione **Enter** para iniciar uma nova linha.
- **Ênfase**: Use um asterisco único (∗) antes e depois do texto para convertê-lo em texto _itálico_, asteriscos duplos (∗∗) para texto em **negrito** e asteriscos triplos (∗∗∗) para _** itálico negrito **_ texto.
- **Blockquotes**: Use o colchete angular de fechamento (>) para criar uma blockquote.
- **Listas**: use hífen (-), asterisco (∗) ou sinal de mais (+) seguido de um espaço em branco para criar uma lista não ordenada e use números seguidos de um ponto final (.) para criar uma lista ordenada.
- **Código**: Use crases (\`) antes e depois do código para denotar `` `code` `` em texto simples, e três crases (\`\`\`) para apresentar ` ```bloco de código` `` `.
- **Réguas horizontais**: Use pelo menos três asteriscos (∗∗∗), hífens (---) ou sublinhados (\_ \_ \_) no início de uma linha para criar uma régua horizontal.
- **Links**: Use colchetes (\[]) para o texto de exibição e parênteses (()) para o endereço do link. Observe que não deve haver espaço entre eles. Por exemplo, `[PocketBlocks](https://github.com/pedrozadotdev/pocketblocks)`.
- **Imagens**: Use um ponto de exclamação (!) para iniciar uma inserção de imagem e, em seguida, use colchetes (\[]) para o texto alternativo e parênteses (()) para o endereço do link ou caminho de origem. A legenda pode seguir os parênteses ou começar em uma nova linha.
- **Caracteres de escape**: Use barra invertida (\\) para exibir os símbolos especiais que o Markdown usa. Por exemplo, para imprimir ` `` ` em texto simples, você deve usar `` \`\` `` em Markdown.&#x20;

Para obter mais informações, consulte [Guia de Markdown](https://www.markdownguide.org/basic-syntax/).

## Extensão GFM

Você também pode usar extensões GitHub Flavored Markdown (GFM) para sintaxe adicional.

- **Notas de rodapé**: use o acento circunflexo (^) e o número entre colchetes (\[]) para inserir notas de rodapé. Para obter mais informações, consulte [Notas de rodapé](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#footnotes).
- **Linhas tachadas**: Use til duplo (\~\~) antes e depois do texto para adicionar linhas tachadas. Para obter mais informações, consulte [Estilização de texto](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#styling-text).
- **Tabelas**: use hífens (-) separados pela barra vertical (|) para criar a linha de cabeçalho de uma tabela e continue usando a barra vertical para separar o conteúdo nas células. Para obter mais informações, consulte [Tabelas (extensão)](https://github.github.com/gfm/#tables-extension-).
- **Listas de tarefas**: use um espaço em branco entre colchetes (\[ ]) no formato de lista para criar listas de tarefas. Para marcar uma tarefa concluída, substitua o espaço em branco pela letra _x_. Para obter mais informações, consulte [Listas de tarefas](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#task-lists).

## Suporte HTML

No PocketBlocks, você pode usar a maioria das tags e propriedades HTML. Para obter mais informações, consulte [Incorporar HTML no Markdown](https://www.markdownguide.org/basic-syntax/#html).

{% hint style="warning" %}
Por motivos de segurança, algumas tags HTML, incluindo **iframe** e **script**, não são permitidas no PocketBlocks.
{% endhint %}

### Apêndice: Tags HTML suportadas

```html
<h1>
<h2>
<h3>
<h4>
<h5>
<h6>
<br>
<b>
<i>
<strong>
<em>
<a>
<pre>
<code>
<img>
<tt>
<div>
<ins>
<del>
<sup>
<sub>
<p>
<ol>
<ul>
<table>
<thead>
<tbody>
<tfoot>
<blockquote>
<dl>
<dt>
<dd>
<kbd>
<q>
<samp>
<var>
<hr>
<ruby>
<rt>
<rp>
<li>
<tr>
<td>
<th>
<s>
<strike>
<summary>
<details>
<caption>
<figure>
<figcaption>
<abbr>
<bdo>
<cite>
<dfn>
<mark>
<small>
<span>
<time>
<wbr>
<input>
```
