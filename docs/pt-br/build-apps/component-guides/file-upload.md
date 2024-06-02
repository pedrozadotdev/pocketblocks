# Envio de arquivo

## Fundamentos

Você pode personalizar as propriedades dos componentes de upload de arquivo no painel direito, como texto exibido, tipos de arquivo e tipo de upload.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/file-upload/01.png" alt=""><figcaption></figcaption></figure>

### Tipo de arquivo

Você pode inserir uma série de strings para restringir os tipos de arquivos a serem carregados. O valor padrão do tipo de arquivo está vazio, o que significa que nenhuma limitação é predefinida. Cada valor de string em uma matriz de tipo de arquivo especificada deve ser um [especificador de tipo de arquivo exclusivo](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#unique_file_type_specifiers) em um dos os seguintes formatos.

- Uma extensão de nome de arquivo válida que não diferencia maiúsculas de minúsculas, começando com um caractere de ponto final ("."), como `.png`, `.txt` e `.pdf`.
- Uma string válida em [formato MIME](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) sem extensão.
- String `audio/*` indicando "qualquer arquivo de áudio".
- String `video/*` indicando "qualquer arquivo de vídeo".
- String `image/*` indicando "qualquer arquivo de imagem".

Por exemplo, quando o valor do tipo de arquivo é `[".pdf", ".mp4", "image/*"]`, você pode fazer upload de arquivos PDF, arquivos MP4 e qualquer tipo de arquivo de imagem.

### Tipo de upload

Você pode decidir se deseja fazer upload de um único arquivo, de vários arquivos ou de um diretório.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/file-upload/02.png" alt=""><figcaption></figcaption></figure>

### Exibir arquivos enviados

Ative ou desative **Mostrar lista de upload** para exibir ou ocultar a lista de arquivos enviados. Você também pode definir essa propriedade por meio do código JS. Por padrão, seu valor é “verdadeiro”.

A lista de upload apresenta os nomes de todos os arquivos carregados em ordem cronológica. Você também pode acessar o nome dos arquivos enviados através da propriedade `files[index].name`. Ao passar o mouse sobre um arquivo, o ícone 🗑️ aparece e você pode clicar nele para excluir o arquivo correspondente.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/file-upload/03.png" alt=""><figcaption></figcaption></figure>

### Analisar arquivos

Alterne **Analisar arquivos** e o PocketBlocks tentará analisar a estrutura de dados do arquivo carregado em objetos, matrizes ou strings. Você pode acessar o resultado analisado através da propriedade `parsedValue`. PocketBlocks oferece suporte à análise de arquivos Excel, JSON e CSV. O resultado da análise de outros tipos de arquivos é `null`.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/file-upload/04.png" alt=""><figcaption></figcaption></figure>

## Validação

Na aba de validação, você pode configurar quantos arquivos podem ser carregados, bem como o tamanho mínimo e máximo de um único arquivo a ser carregado.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/file-upload/05.png" alt=""><figcaption></figcaption></figure>

### Máximo de arquivos

Quando o tipo de upload é "Múltiplo" ou "Diretório", você pode definir **Máximo de arquivos** para limitar o número máximo de arquivos a serem carregados. Se o número de arquivos a serem carregados exceder esse limite, os arquivos carregados mais recentemente substituirão os mais antigos.

### Tamanho do arquivo

Você pode definir o tamanho mínimo e máximo dos arquivos para upload, usando unidades KB, MB, GB ou TB. A unidade padrão para tamanho de arquivo é byte. Quando o tamanho do arquivo enviado exceder o limite, você verá um alerta global.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/file-upload/06.png" alt=""><figcaption></figcaption></figure>

### Acessando os arquivos enviados

Os arquivos carregados por meio do componente de upload de arquivo são armazenados na memória cache do navegador em formato de string **codificado em base64**. Para armazenar esses arquivos em fontes de dados, você precisa criar consultas para conectar-se a bancos de dados ou APIs. Você pode visualizar as propriedades dos arquivos enviados no navegador de dados no painel esquerdo ou acessar os nomes das propriedades em `{{}}` ou Consultas JS via código JS. As propriedades comumente usadas são as seguintes.

- `value`: Uma lista do conteúdo dos arquivos enviados, codificados em base64.
- `files`: Uma lista de metadados dos arquivos enviados, incluindo `uid`, `name`, `type`, `size` e `lastModified`.
- `parsedValue`: Uma lista do valor dos arquivos analisados.

<figure><img src="../../.gitbook/assets/build-apps/component-guides/file-upload/07.png" alt=""><figcaption></figcaption></figure>
