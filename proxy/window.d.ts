import { AxiosInstance } from "axios";
import { UploadRequestOption } from "@/types";
import { PocketBase } from "pocketbase";
import { QueryClient } from "@tanstack/query-core";

export {};

declare global {
  interface Window {
    pb: PocketBase;
    qc: QueryClient;
    uploadAvatar: (config: UploadRequestOption) => void;
    setupProxy: (axiosIns: AxiosInstance, messageIns: unknown) => AxiosInstance;
  }
}
