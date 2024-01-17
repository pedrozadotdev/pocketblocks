import { settings } from "@/api";
import { mocker } from "@/mocker";
import {
  adminRoute,
  createDefaultErrorResponse,
  createDefaultResponse,
  getAuthConfigs,
} from "@/utils";

export default [
  mocker.get("/api/v1/configs", async () => {
    const settingsResponse = await settings.get();
    if (settingsResponse.data) {
      const { name, headerColor, logo, icon } = settingsResponse.data;
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
          brandName: name,
          headerColor,
        },
      });
    }
    return createDefaultErrorResponse([settingsResponse]);
  }),
  mocker.put(
    "/api/v1/configs/custom-configs",
    adminRoute(async (req) => {
      const { branding } = req.config.data;
      let settingsResponse: Awaited<ReturnType<typeof settings.update>> = {
        status: 502,
      };
      if (branding) {
        const { brandName, headerColor, favicon, logo } = branding;
        settingsResponse = await settings.update({
          name: brandName,
          headerColor,
          icon: favicon,
          logo,
        });
      }
      if (settingsResponse.data) {
        const { name, headerColor, logo, icon } = settingsResponse.data;
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
            brandName: name,
            headerColor,
          },
        });
      }
      return createDefaultErrorResponse([settingsResponse]);
    }),
  ),
];
