import { settings } from "@/api";
import { mocker } from "@/mocker";
import {
  createDefaultErrorResponse,
  createDefaultResponse,
  getAuthConfigs,
} from "@/utils";

export default [
  mocker.get("/api/v1/configs", async () => {
    const settingsResponse = await settings.get();
    if (settingsResponse.data) {
      const { orgName, headerColor, logo, icon } = settingsResponse.data;
      return createDefaultResponse({
        authConfigs: await getAuthConfigs(),
        workspaceMode: "ENTERPRISE",
        selfDomain: false,
        cookieName: "TOKEN",
        cloudHosting: false,
        featureFlag: {
          enableCustomBranding: true,
        },
        branding: {
          logo,
          favicon: icon,
          brandName: orgName,
          headerColor: headerColor,
        },
      });
    }
    return createDefaultErrorResponse([settingsResponse]);
  }),
];
