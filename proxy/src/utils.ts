import { apps as appsAPI, auth, settings as settingsAPI } from "@/api";
import { MockHandler, MockRequest, MockResponse } from "@/mocker";
import { APIResponse, Application, Folder } from "@/types";

export async function createAppList(apps: Application[]) {
  const admin = await auth.isAdmin();
  return apps.map((a) => ({
    orgId: "STATIC",
    applicationId: a.slug,
    name: a.name,
    createAt: new Date(a.created).getTime(),
    createBy:
      typeof a.created_by === "string" ? a.created_by : a.created_by.name,
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

export async function createFullAppResponseData(app: Application) {
  const { data: settings } = await settingsAPI.get();
  return {
    applicationInfoView: (await createAppList([app]))[0],
    applicationDSL: app.app_dsl,
    moduleDSL: app.module_dsl,
    orgCommonSettings: settings
      ? {
          themeList: settings.themes,
          defaultHomePage: settings.home_page,
          defaultTheme: settings.theme,
          preloadCSS: settings.css,
          preloadJavaScript: settings.script,
          preloadLibs: settings.libs,
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
        orgId: "STATIC",
        folderId: f.id,
        parentFolderId: null,
        name: f.name,
        createAt: new Date(f.created).getTime(),
        createBy:
          typeof f.created_by === "string" ? f.created_by : f.created_by.name,
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

export function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, "-");
}
