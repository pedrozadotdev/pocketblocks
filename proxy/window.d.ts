import { AxiosInstance } from "axios";

export {};

declare global {
  interface Window {
    sdk: unknown;
    setupProxy: (axiosIns: AxiosInstance) => void;
  }
}
