import { apps, auth, folders, settings } from "@/api";
import { mocker } from "@/mocker";
import { Application, Folder, Settings, FullUser } from "@/types";
import {
  authRoute,
  createAppList,
  createDefaultErrorResponse,
  createDefaultResponse,
  createFolderList,
  getAuthConfigs,
} from "@/utils";
import { t } from "@/i18n";

const createResponseData = async (
  user: FullUser,
  systemSettings: Settings,
  folders: Folder[],
  apps: Application[],
) => {
  return {
    user: {
      id: user.id,
      createdBy: "anonymousId",
      name: user.name !== "NONAME" ? user.name || t("changeMe") : t("changeMe"),
      avatar: null,
      tpAvatarLink: null,
      state: "ACTIVATED",
      isEnabled: true,
      isAnonymous: false,
      connections: [
        {
          authId: "EMAIL",
          source: "EMAIL",
          name:
            user.name !== "NONAME" ? user.name || t("changeMe") : t("changeMe"),
          avatar: null,
          rawUserInfo: {
            email: user.email,
            username: (await auth.isAdmin()) ? "ADMIN" : user.username,
          },
          tokens: [],
        },
      ],
      hasSetNickname: true,
      orgTransformedUserInfo: null,
    },
    organization: {
      id: "ORG_ID",
      createdBy: "anonymousId",
      name: systemSettings.org_name,
      isAutoGeneratedOrganization: true,
      contactName: null,
      contactEmail: null,
      contactPhoneNumber: null,
      source: null,
      thirdPartyCompanyId: null,
      state: "ACTIVE",
      commonSettings: {
        themeList: systemSettings.themes,
        defaultHomePage:
          typeof systemSettings.home_page === "string"
            ? systemSettings.home_page
            : systemSettings.home_page?.slug,
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
    folderInfoViews: await createFolderList(folders),
    homeApplicationViews: await createAppList(apps),
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function showVerifiedMessage(user: FullUser, messageIns: any) {
  const urlParams = new URLSearchParams(window.location.search);
  const verifyToken = urlParams.get("verifyEmailToken");
  const authConfig = (await getAuthConfigs())[0];
  const isAdmin = await auth.isAdmin();
  if (verifyToken) {
    const { status } = await auth.verifyEmailToken(verifyToken);
    messageIns.destroy();
    if (status === 200) {
      messageIns.info(t("emailVerified"));
    } else {
      messageIns.error(t("serverError"));
    }
  } else if (
    !isAdmin &&
    authConfig.customProps.type.includes("email") &&
    !user.verified
  ) {
    messageIns.destroy();
    messageIns.info({
      content: t("emailVerifiedSentWithLink"),
      duration: 0,
      style: { cursor: "pointer" },
      onClick: () => {
        auth.sendVerifyEmail().then((response) => {
          messageIns.destroy();
          if (response.status === 200) {
            messageIns.info(t("emailVerifiedSent"));
          } else {
            messageIns.error(t("serverError"));
          }
        });
      },
    });
  }
}

export default [
  mocker.get(
    "/api/v1/applications/home",
    authRoute(async ({ messageIns }) => {
      const userResponse = await auth.getCurrentUser();
      const appsResponse = await apps.list();
      const foldersResponse = await folders.list();
      const settingsResponse = await settings.get();
      if (
        userResponse.data &&
        appsResponse.data &&
        foldersResponse.data &&
        settingsResponse.data
      ) {
        await showVerifiedMessage(userResponse.data, messageIns);
        return createDefaultResponse(
          await createResponseData(
            userResponse.data,
            settingsResponse.data,
            foldersResponse.data,
            appsResponse.data,
          ),
        );
      }
      return createDefaultErrorResponse([
        userResponse,
        appsResponse,
        foldersResponse,
        settingsResponse,
      ]);
    }),
  ),
];
