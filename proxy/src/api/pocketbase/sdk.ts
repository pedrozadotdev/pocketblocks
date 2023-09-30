import { UploadRequestOption } from "@/types";
import { pb } from "./utils";

export const client = pb;

export const setup = () => {
  window.sdk = pb;
  window.uploadAvatar = (config: UploadRequestOption) => {
    console.log(config);
  };
};
