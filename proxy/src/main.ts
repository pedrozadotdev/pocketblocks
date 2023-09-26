import { AxiosInstance } from "axios";
import MockAdapter from "axios-mock-adapter";
import { sdk } from "@/api";
import mocks from "@/mocks";

sdk.setup();

let mockIns: MockAdapter;

window.setupProxy = (axiosIns: AxiosInstance) => {
  if (!mockIns) {
    mockIns = new MockAdapter(axiosIns, {
      onNoMatch: import.meta.env.PROD ? "passthrough" : "throwException",
    });
    mocks.forEach((registerMock) => registerMock(mockIns));
    if (import.meta.env.DEV) {
      mockIns.onAny().reply((config) => {
        console.warn("[PROXY]: Request without handler!\n", config);
        return [404, {}];
      });
      console.warn("[PROXY]: Mock applied!");
    }
  }
};
