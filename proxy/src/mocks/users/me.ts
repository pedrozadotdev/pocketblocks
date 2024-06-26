import { auth, settings, users } from "@/api";
import { mocker } from "@/mocker";
import { Settings, User } from "@/types";
import {
  authRoute,
  createDefaultErrorResponse,
  createDefaultResponse,
  getAuthConfigs,
} from "@/utils";
import { t } from "@/i18n";

const defaultDataResponse = {
  id: null,
  orgAndRoles: null,
  currentOrgId: null,
  username: t("anonymous"),
  connections: null,
  avatar: null,
  avatarUrl: null,
  hasPassword: false,
  hasSetNickname: false,
  hasShownNewUserGuidance: false,
  userStatus: null,
  createdTimeMs: 0,
  ip: "",
  enabled: false,
  anonymous: true,
  orgDev: false,
  isAnonymous: true,
  isEnabled: false,
};

const createResponseData = async (user: User, systemSettings: Settings) => {
  const isAdmin = await auth.isAdmin();
  return {
    ...defaultDataResponse,
    id: user.id,
    orgAndRoles: [
      {
        org: {
          id: "ORG_ID",
          createdBy: "",
          name: systemSettings.name,
          isAutoGeneratedOrganization: true,
          contactName: null,
          contactEmail: null,
          contactPhoneNumber: null,
          source: null,
          thirdPartyCompanyId: null,
          state: "ACTIVE",
          commonSettings: {
            themeList: systemSettings.themes,
            defaultHomePage: systemSettings.homePage
              ? systemSettings.homePage
              : undefined,
            defaultTheme: systemSettings.theme,
            preloadCSS: systemSettings.css,
            preloadJavaScript: systemSettings.script,
            preloadLibs: systemSettings.libs,
            npmPlugins: systemSettings.plugins || [],
          },
          logoUrl: systemSettings.logo,
          createTime: 0,
          authConfigs: await getAuthConfigs(),
        },
        role: isAdmin ? "admin" : "member",
      },
    ],
    currentOrgId: "ORG_ID",
    username: isAdmin ? t("admin") : user.name,
    connections: [
      {
        authId: "EMAIL",
        source: "EMAIL",
        name: user.email,
        avatar: user.avatar ?? null,
        rawUserInfo: {
          email: user.email,
          username: isAdmin ? "ADMIN" : user.username,
        },
        tokens: [],
      },
    ],
    avatar: user.avatar ?? null,
    avatarUrl: user.avatar ?? null,
    hasPassword: true,
    hasSetNickname: true,
    hasShownNewUserGuidance: false,
    userStatus: {
      newUserGuidance: !systemSettings.showTutorial.includes(user.id),
    },
    createdTimeMs: new Date(user.created).getTime(),
    ip: "",
    enabled: false,
    anonymous: false,
    orgDev: isAdmin,
    isAnonymous: false,
    isEnabled: false,
  };
};

export default [
  mocker.get("/api/v1/users/me", async () => {
    const userResponse = await auth.getCurrentUser();
    if (!userResponse.data) {
      return createDefaultResponse(defaultDataResponse);
    }
    const settingsResponse = await settings.get();
    if (settingsResponse.data) {
      return createDefaultResponse(
        await createResponseData(userResponse.data, settingsResponse.data),
      );
    }
    return createDefaultErrorResponse([settingsResponse, userResponse]);
  }),
  mocker.put(
    "/api/v1/users",
    authRoute(async (req) => {
      const { name, username } = req.config.data;
      const authResponse = await auth.getCurrentUser();
      if (!authResponse.data) {
        return createDefaultErrorResponse([{ status: 401 }]);
      }
      const updateUserResponse = await users.update({
        id: authResponse.data.id,
        name,
        username,
      });
      if (updateUserResponse.status === 200) {
        const userResponse = await auth.getCurrentUser();
        const settingsResponse = await settings.get();
        if (userResponse.data && settingsResponse.data) {
          return createDefaultResponse(
            await createResponseData(userResponse.data, settingsResponse.data),
          );
        }
        return createDefaultErrorResponse([userResponse, settingsResponse]);
      }
      return createDefaultErrorResponse([updateUserResponse]);
    }),
  ),
];
