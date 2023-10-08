import { AxiosInstance } from "axios";
import MockAdapter from "axios-mock-adapter";
import { sdk } from "@/api";
import mocks from "@/mocks";

sdk.setup();

let mockIns: MockAdapter;

window.setupProxy = (axiosIns: AxiosInstance, messageIns: unknown) => {
  if (!mockIns) {
    mockIns = new MockAdapter(axiosIns, {
      onNoMatch: import.meta.env.PROD ? "passthrough" : "throwException",
    });
    mocks.forEach((registerMock) => registerMock(mockIns, messageIns));
    if (import.meta.env.DEV) {
      mockIns.onAny().reply((config) => {
        console.warn(
          `[PROXY]: ${config.method?.toUpperCase()} - "${
            config.url
          }" (Request without handler!) \nRequest: `,
          config,
        );
        return [404, {}];
      });
      console.warn("[PROXY]: Mock applied!");
    }
  }
};
