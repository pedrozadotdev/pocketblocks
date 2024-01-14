import { apps as appsAPI, auth, settings as settingsAPI } from "@/api";
import { MockHandler, MockRequest, MockResponse } from "@/mocker";
import {
  APIResponse,
  AppPermissionOp,
  Application,
  Auths,
  Folder,
  LocalAuthInfo,
  OauthAuth,
} from "@/types";

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
    folderId: a.folder,
    lastViewTime: new Date(a.updated).getTime(),
    lastModifyTime: new Date(a.updated).getTime(),
    publicToAll: a.public,
    folder: false,
  }));
}

function getCorrectDSL(app: Application) {
  const editDSLPaths = [`/apps/${app.slug}/edit`, `/apps/${app.slug}/preview`];
  return editDSLPaths.includes(window.location.pathname)
    ? app.editDSL
    : app.appDSL;
}

export async function createFullAppResponseData(app: Application) {
  const { data: settings } = await settingsAPI.get();
  return {
    applicationInfoView: (await createAppList([app]))[0],
    applicationDSL: JSON.parse(getCorrectDSL(app)),
    moduleDSL: {},
    orgCommonSettings: settings
      ? {
          themeList: settings.themes ? JSON.parse(settings.themes) : [],
          defaultHomePage: settings.homePage ? settings.homePage : undefined,
          defaultTheme: settings.theme,
          preloadCSS: settings.css,
          preloadJavaScript: settings.script,
          preloadLibs: settings.libs ? JSON.parse(settings.libs) : [],
          npmPlugins: settings.plugins ? JSON.parse(settings.plugins) : [],
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

interface Oauth extends OauthAuth {
  name: string;
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
    setupAdmin: false,
    smtp: false,
    localAuthInfo: {
      minPasswordLength: 8,
      requireEmail: false,
    } as LocalAuthInfo,
  },
  oauth: [] as Oauth[],
};

export async function getAuthConfigs() {
  const usersInfoResponse = await settingsAPI.getUsersInfo();
  const settingsResponse = await settingsAPI.get();
  const isAdmin = await auth.isAdmin();
  const result = defaultAuthConfig;
  if (
    usersInfoResponse.status === 200 &&
    usersInfoResponse.data &&
    settingsResponse.status === 200 &&
    settingsResponse.data
  ) {
    const {
      authMethods,
      userFieldUpdate,
      canUserSignUp,
      setupFirstAdmin,
      smtpStatus,
      localAuthInfo,
    } = usersInfoResponse.data;
    const auths = settingsResponse.data.auths;
    result.enable =
      authMethods.includes("email") || authMethods.includes("username");
    result.enableRegister = canUserSignUp;
    result.customProps = {
      label: auths.local.label,
      mask: auths.local.inputMask,
      type: [
        ...(authMethods.includes("email") ? ["email"] : []),
        ...(authMethods.includes("username") ? ["username"] : []),
      ],
      allowUpdate: isAdmin ? [] : userFieldUpdate ?? [],
      setupAdmin: setupFirstAdmin,
      smtp: smtpStatus,
      localAuthInfo,
    };
    result.oauth = authMethods
      .filter((m) => m !== "username" && m !== "email")
      .map((name) => {
        const { customIconUrl, customName } = auths[
          name as keyof Auths
        ] as OauthAuth;
        return {
          name,
          customIconUrl,
          customName: customName
            ? customName
            : name.toUpperCase() + name.slice(1),
        } as Oauth;
      });
  }
  return [result];
}

export function updatePermissions(
  groups: string[],
  users: string[],
  ops: AppPermissionOp[],
) {
  const removeGroups = ops
    .filter((o) => o.op === "REMOVE" && o.type === "GROUP")
    .map((o) => o.id);
  const removeUsers = ops
    .filter((o) => o.op === "REMOVE" && o.type === "USER")
    .map((o) => o.id);
  const addGroups = ops
    .filter((o) => o.op === "ADD" && o.type === "GROUP")
    .map((o) => o.id);
  const addUsers = ops
    .filter((o) => o.op === "ADD" && o.type === "USER")
    .map((o) => o.id);
  groups = [...groups.filter((g) => !removeGroups.includes(g)), ...addGroups];
  users = [...users.filter((u) => !removeUsers.includes(u)), ...addUsers];
  return { groups, users };
}
