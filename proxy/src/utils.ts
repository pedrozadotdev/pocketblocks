import { apps as appsAPI, auth, settings as settingsAPI } from "@/api";
import { MockHandler, MockRequest, MockResponse } from "@/mocker";
import { APIResponse, Application, Auth, Folder } from "@/types";

export async function createAppList(apps: Application[]) {
  const admin = await auth.isAdmin();
  return apps.map((a) => ({
    orgId: "ORG_ID",
    applicationId: a.slug,
    name: a.name,
    createAt: new Date(a.created).getTime(),
    role: admin ? "owner" : "viewer",
    applicationType: a.type,
    applicationStatus: a.status,
    folderId: typeof a.folder === "string" ? a.folder : a.folder?.id,
    lastViewTime: new Date(a.updated).getTime(),
    lastModifyTime: new Date(a.updated).getTime(),
    publicToAll: a.public,
    folder: false,
  }));
}

function getCorrectDSL(app: Application) {
  const editDSLPaths = [`/apps/${app.slug}/edit`, `/apps/${app.slug}/preview`];
  return editDSLPaths.includes(window.location.pathname)
    ? app.edit_dsl
    : app.app_dsl;
}

export async function createFullAppResponseData(app: Application) {
  const { data: settings } = await settingsAPI.get();
  return {
    applicationInfoView: (await createAppList([app]))[0],
    applicationDSL: getCorrectDSL(app),
    moduleDSL: {},
    orgCommonSettings: settings
      ? {
          themeList: settings.themes,
          defaultHomePage:
            typeof settings.home_page === "string"
              ? settings.home_page
              : settings.home_page?.slug,
          defaultTheme: settings.theme,
          preloadCSS: settings.css,
          preloadJavaScript: settings.script,
          preloadLibs: settings.libs,
          npmPlugins: settings.plugins || [],
        }
      : null,
    templateId: null,
  };
}

export async function createFolderList(folders: Folder[]) {
  const admin = await auth.isAdmin();
  const results = await Promise.all(
    folders.map(async (f) => {
      const appsResponse = await appsAPI.list({ folderId: f.id });
      return {
        orgId: "ORG_ID",
        folderId: f.id,
        parentFolderId: null,
        name: f.name,
        createAt: new Date(f.created).getTime(),
        subFolders: null,
        subApplications: appsResponse.data
          ? await createAppList(appsResponse.data)
          : [],
        createTime: new Date(f.created).getTime(),
        lastViewTime: new Date(f.updated).getTime(),
        visible: true,
        manageable: admin,
        folder: true,
      };
    }),
  );
  return admin ? results : results.filter((f) => f.subApplications.length > 0);
}

export function createDefaultResponse<D>(data?: D): MockResponse {
  return {
    status: 200,
    body: {
      code: 1,
      message: "",
      success: true,
      data,
    },
  };
}

export function createDefaultErrorResponse(
  apiResponses: Awaited<APIResponse<unknown>>[],
): MockResponse {
  for (const response of apiResponses) {
    if (response.status > 299) {
      return {
        status: response.status,
        body: {
          code: response.status,
          message: response.message || "",
          success: false,
        },
      };
    }
  }
  return createDefaultResponse();
}

export function authRoute(handler: MockHandler): MockHandler {
  return async (req: MockRequest) => {
    const isLoggedIn = await auth.isLoggedIn();
    return isLoggedIn
      ? handler(req)
      : createDefaultErrorResponse([{ status: 401 }]);
  };
}

export function adminRoute(handler: MockHandler): MockHandler {
  return async (req: MockRequest) => {
    const isAdmin = await auth.isAdmin();
    return isAdmin
      ? handler(req)
      : createDefaultErrorResponse([{ status: 401 }]);
  };
}

const defaultAuthConfig = {
  authType: "FORM",
  id: "EMAIL",
  enable: false,
  enableRegister: false,
  source: "EMAIL",
  sourceName: "EMAIL",
  customProps: {
    label: "",
    mask: "",
    type: ["email"],
    allowUpdate: [] as string[],
  },
  oauth: [] as Auth[],
};

export async function getAuthConfigs() {
  const authMethodsResponse = await auth.getAuthMethods();
  const isAdmin = await auth.isAdmin();
  const result = defaultAuthConfig;
  if (authMethodsResponse.status === 200 && authMethodsResponse.data) {
    const authMethods = authMethodsResponse.data;
    const localAuth = authMethods?.find((am) => am.type === "local");
    if (isAdmin) {
      localAuth?.local_allow_update?.push("password");
    }
    if (localAuth) {
      result.enable = true;
      result.enableRegister = localAuth.allow_signup;
      result.customProps = {
        label: localAuth.local_id_label ?? "",
        mask: localAuth.local_id_input_mask ?? "",
        type: localAuth.local_id_type ?? [],
        allowUpdate: localAuth.local_allow_update ?? [],
      };
    }
    result.oauth = authMethods?.filter((am) => am.type !== "local");
  }
  return [result];
}
