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
      const { org_name, header_color, logo, icon, anon_template_view } =
        settingsResponse.data;
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
          brandName: org_name,
          headerColor: header_color,
          enableTemplateViewMode: anon_template_view,
        },
      });
    }
    return createDefaultErrorResponse([settingsResponse]);
  }),
];
