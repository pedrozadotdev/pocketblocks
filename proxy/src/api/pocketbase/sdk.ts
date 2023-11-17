import { UploadRequestError, UploadRequestOption } from "@/types";
import * as auth from "./auth";
import { pb } from "./utils";

export const client = pb;

const sdk = new Proxy(pb, {
  set() {
    throw new Error("SDK is immutable");
  },
});

export const setup = () => {
  window.sdk = sdk;
  window.uploadAvatar = async (config: UploadRequestOption) => {
    const { data: user } = await auth.getCurrentUser();
    if (user) {
      try {
        await pb.collection("pbl_users").update(user.id, {
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
