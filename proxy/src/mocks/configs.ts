import { settings } from "@/api";
import { AUTH_CONFIGS } from "@/constants";
import { mocker } from "@/mocker";
import { createDefaultErrorResponse, createDefaultResponse } from "@/utils";

export default [
  mocker.get("/api/v1/configs", async () => {
    const settingsResponse = await settings.get();
    if (settingsResponse.data) {
      const { logo, icon } = await settings.getFilesURL(settingsResponse.data);
      return createDefaultResponse({
        authConfigs: AUTH_CONFIGS,
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
          brandName: settingsResponse.data.org_name,
          headerColor: settingsResponse.data.header_color,
        },
      });
    }
    return createDefaultErrorResponse([settingsResponse]);
  }),
];
