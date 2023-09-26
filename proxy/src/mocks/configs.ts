import { AUTH_CONFIGS } from "@/constants";
import { mocker, MockResponse } from "@/mocker";

const responseData: MockResponse = {
  status: 200,
  body: {
    code: 1,
    message: "",
    data: {
      authConfigs: AUTH_CONFIGS,
      workspaceMode: "ENTERPRISE",
      selfDomain: false,
      cookieName: "TOKEN",
      cloudHosting: false,
    },
    success: true,
  },
};

export default [mocker.get("/api/v1/configs", async () => responseData)];
