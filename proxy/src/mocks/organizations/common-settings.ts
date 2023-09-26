import { settings } from "@/api";
import { mocker } from "@/mocker";
import {
  adminRoute,
  authRoute,
  createDefaultErrorResponse,
  createDefaultResponse,
} from "@/utils";

const renamedParams = {
  themeList: "themes",
  defaultHomePage: "home_page",
  defaultTheme: "theme",
  preloadCSS: "css",
  preloadJavaScript: "script",
  preloadLibs: "libs",
};

export default [
  mocker.get(
    "/api/organizations/:id/common-settings",
    authRoute(async () => {
      const settingsResponse = await settings.get();
      if (settingsResponse.data) {
        const { themes, home_page, theme, css, script, libs } =
          settingsResponse.data;
        return createDefaultResponse({
          themeList: themes,
          defaultHomePage: home_page,
          defaultTheme: theme,
          preloadCSS: css,
          preloadJavaScript: script,
          preloadLibs: libs,
        });
      }
      return createDefaultErrorResponse([settingsResponse]);
    }),
  ),
  mocker.put(
    "/api/organizations/:id/common-settings",
    adminRoute(async (req) => {
      const { key, value = "" } = req.config.data as {
        key: keyof typeof renamedParams;
        value?: unknown;
      };
      const bodyParams: { [key: string]: string } = {};
      bodyParams[renamedParams[key]] =
        typeof value === "string" ? value : !value ? "" : JSON.stringify(value);
      const settingsResponse = await settings.update({
        id: req.params.id as string,
        ...bodyParams,
      });
      if (settingsResponse.status === 200) {
        return createDefaultResponse(true);
      }
      return createDefaultErrorResponse([settingsResponse]);
    }),
  ),
];
