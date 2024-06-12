# Where are the Data Sources/Query Library?

PocketBlocks integrates Openblocks and PocketBase, or at least the client's part. As this project aims to create as much flexibility as possible between those two software, we opted not to port the **data source/query library** features as we have access to the [Pocketbase SDK](https://pocketbase.io/docs/client-side-sdks/) through **window.pb**. We also can use the [extend features](https://pocketbase.io/docs/js-overview/) of Pocketbase to integrate with data sources using something like [n8n](https://n8n.io/) or [Zarpier](https://zapier.com/).

{% hint style="info" %}
We also provide a [QueryClient instance](https://tanstack.com/query/v5/docs/reference/QueryClient) for caching purposes. You can access it with **window.qc**. It uses sessionStorage with a staleTime of 5 minutes.
{% endhint %}
