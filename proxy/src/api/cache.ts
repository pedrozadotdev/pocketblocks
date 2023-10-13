import { API } from "@/types";
import { Query, QueryClient } from "@tanstack/query-core";
import { persistQueryClientSubscribe } from "@tanstack/query-persist-client-core";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { compress, decompress } from "lz-string";

type Fn<A extends unknown[], R> = (...args: A) => Promise<R>;

export const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5 * 60 * 1000 } },
});

persistQueryClientSubscribe({
  queryClient,
  persister: createSyncStoragePersister({
    storage: window.sessionStorage,
    serialize: (data) => compress(JSON.stringify(data)),
    deserialize: (data) => JSON.parse(decompress(data)),
  }),
});

function applyCache<A extends unknown[], R>(
  firstKey: string,
  fn: Fn<A, R>,
): Fn<A, R> {
  return function (...args: A): Promise<R> {
    return queryClient.fetchQuery({
      queryKey: [firstKey, ...args.filter((a) => !!a)],
      queryFn: () => {
        return fn(...args);
      },
    });
  };
}
function invalidateCache<A extends unknown[], R>(
  createPredicateFn: (...args: A) => Promise<(query: Query) => boolean>,
  fn: Fn<A, R>,
): Fn<A, R> {
  return async function (...args: A): Promise<R> {
    const predicate = await createPredicateFn(...args);
    const result = await fn(...args);
    await queryClient.invalidateQueries({ predicate });
    return result;
  };
}

const invalidateFolders: Parameters<typeof invalidateCache>[0] = async () => {
  return ({ queryKey }) => {
    const listAppsArgs = queryKey[1] as Parameters<API["apps"]["list"]>[0];
    const firstCondition = queryKey[0] === "listFolders";
    const secondCondition =
      queryKey[0] === "listApps" && !listAppsArgs?.folderId;

    return firstCondition || secondCondition;
  };
};

export function applyAPICache(api: API): API {
  return {
    ...api,
    apps: {
      get: applyCache("getApp", api.apps.get),
      list: applyCache("listApps", api.apps.list),
      update: invalidateCache(async (params) => {
        return ({ queryKey }) => {
          const getArgs = queryKey[1] as Parameters<API["apps"]["get"]>[0];
          const folderId =
            typeof params.folder === "string"
              ? params.folder
              : params.folder?.id;
          const firstCondition =
            queryKey[0] === "listApps" &&
            (!!params.status || typeof folderId === "string");
          const secondCondition =
            queryKey[0] === "getApp" && getArgs === params.slug;
          return firstCondition || secondCondition;
        };
      }, api.apps.update),
      remove: invalidateCache(async (slug) => {
        return ({ queryKey }) => {
          const listArgs = queryKey[1] as Parameters<API["apps"]["list"]>[0];
          const getArgs = queryKey[1] as Parameters<API["apps"]["get"]>[0];
          const firstCondition =
            queryKey[0] === "listApps" && !!listArgs?.onlyRecycled;
          const secondCondition = queryKey[0] === "getApp" && getArgs === slug;

          return firstCondition || secondCondition;
        };
      }, api.apps.remove),
      create: invalidateCache(async (params) => {
        return ({ queryKey }) => {
          const listArgs = queryKey[1] as Parameters<API["apps"]["list"]>[0];
          return (
            queryKey[0] === "listApps" && params.folder === listArgs?.folderId
          );
        };
      }, api.apps.create),
    },
    auth: {
      ...api.auth,
      getCurrentUser: applyCache("getCurrentUser", api.auth.getCurrentUser),
      getAuthMethods: applyCache("getAuthMethods", api.auth.getAuthMethods),
      verifyEmailToken: invalidateCache(async () => {
        return ({ queryKey }) => {
          return queryKey[0] === "getCurrentUser";
        };
      }, api.auth.verifyEmailToken),
    },
    folders: {
      list: applyCache("listFolders", api.folders.list),
      create: invalidateCache(invalidateFolders, api.folders.create),
      update: invalidateCache(invalidateFolders, api.folders.update),
      remove: invalidateCache(invalidateFolders, api.folders.remove),
    },
    groups: {
      list: applyCache("listGroups", api.groups.list),
    },
    settings: {
      get: applyCache("getSettings", api.settings.get),
      update: invalidateCache(async () => {
        return ({ queryKey }) => {
          return queryKey[0] === "getSettings";
        };
      }, api.settings.update),
    },
    snapshots: {
      get: applyCache("getSnapshot", api.snapshots.get),
      list: applyCache("listSnapshots", api.snapshots.list),
      create: invalidateCache(async ({ app }) => {
        return ({ queryKey }) => {
          const listArgs = queryKey[1] as Parameters<
            API["snapshots"]["list"]
          >[0];
          return (
            queryKey[0] === "listSnapshots" &&
            listArgs.app.id === (typeof app === "string" ? app : app?.id)
          );
        };
      }, api.snapshots.create),
    },
    users: {
      get: applyCache("getUser", api.users.get),
      list: applyCache("listUsers", api.users.list),
      update: invalidateCache(async () => {
        return ({ queryKey }) => {
          return queryKey[0] === "getUser" || queryKey[0] === "listUsers";
        };
      }, api.users.update),
    },
  };
}
