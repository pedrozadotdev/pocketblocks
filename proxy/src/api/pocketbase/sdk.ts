import { UploadRequestError, UploadRequestOption } from "@/types";
import * as auth from "./auth";
import { pb } from "./utils";
import { QueryClient } from "@tanstack/query-core";
import { persistQueryClientSubscribe } from "@tanstack/query-persist-client-core";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { compress, decompress } from "lz-string";

export const client = pb;

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5 * 60 * 1000 } },
});

persistQueryClientSubscribe({
  queryClient,
  persister: createSyncStoragePersister({
    storage: window.sessionStorage,
    key: "SDK_CACHE",
    serialize: (data) => compress(JSON.stringify(data)),
    deserialize: (data) => JSON.parse(decompress(data)),
  }),
});

const pbProxy = new Proxy(pb, {
  set() {
    throw new Error("SDK is immutable");
  },
});

export const setup = () => {
  window.qc = queryClient;
  window.pb = pbProxy;
  window.uploadAvatar = async (config: UploadRequestOption) => {
    const { data: user } = await auth.getCurrentUser();
    if (user) {
      try {
        await pb.collection("users").update(user.id, {
          avatar: config.file,
        });
        if (config.onSuccess) {
          config.onSuccess({});
        }
      } catch (e) {
        if (config.onError) {
          config.onError(e as UploadRequestError);
        }
      }
    }
  };
};
