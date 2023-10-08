import { AxiosInstance } from "axios";
import { UploadRequestOption } from "@/types";

export {};

declare global {
  interface Window {
    sdk: unknown;
    uploadAvatar: (config: UploadRequestOption) => void;
    setupProxy: (axiosIns: AxiosInstance, messageIns: unknown) => void;
  }
}
