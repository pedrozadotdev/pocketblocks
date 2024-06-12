# Onde estão as fontes de dados/biblioteca de consultas?

PocketBlocks integra Openblocks e PocketBase, ou pelo menos a parte do cliente. Como este projeto visa criar o máximo de flexibilidade possível entre esses dois softwares, optamos por não portar os recursos **fonte de dados/biblioteca de consulta**, pois temos acesso ao [Pocketbase SDK](https://pocketbase.io/docs/client-side-sdks/) por meio do **window.pb**. Também podemos usar os [recursos de extensão](https://pocketbase.io/docs/js-overview/) do Pocketbase para integração com fontes de dados usando algo como [n8n](https://n8n.io/) ou [ Zarpier](https://zapier.com/).

{% dica estilo = "info" %}
Também fornecemos uma [instância do QueryClient](https://tanstack.com/query/v5/docs/reference/QueryClient) para fins de armazenamento em cache. Você pode acessá-lo com **window.qc**. Ele usa sessionStorage com staleTime de 5 minutos.
{% endhint %}
