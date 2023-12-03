import { AxiosInstance } from "axios";

export {};

declare global {
  interface Window {
    printPerf: () => void;
    __OPENBLOCKS_DEV__?: {};
    setupProxy?: (axiosIns: AxiosInstance, message: unknown) => AxiosInstance;
  }
}
