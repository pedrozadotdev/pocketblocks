import { Settings, APIResponse, UsersInfo } from "@/types";
import { pbl, createDefaultErrorResponse } from "./utils";

export async function get(): APIResponse<Settings> {
  try {
    const settings = await pbl.settings.getAll();
    Object.keys(settings.auths).forEach((k) => {
      const key = k as keyof typeof settings.auths;
      if (key !== "local") {
        const { customIconUrl, customName } = settings.auths[key];
        const [defaultIconUrl, defaultName] = [
          `/_/images/oauth2/${key}.svg`,
          key[0].toUpperCase() + key.slice(1),
        ];
        settings.auths[key].defaultIconUrl = defaultIconUrl;
        settings.auths[key].defaultName = defaultName;
        settings.auths[key].customIconUrl = customIconUrl;
        settings.auths[key].customName = customName;
      }
    });
    return {
      status: 200,
      data: settings,
    };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}

export async function update(params: Partial<Settings>): APIResponse<Settings> {
  try {
    const settings = await pbl.settings.update(params);
    return { status: 200, data: settings };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}

export async function getUsersInfo(): APIResponse<UsersInfo> {
  try {
    const usersInfo = await pbl.settings.getUsersInfo();
    return {
      status: 200,
      data: usersInfo,
    };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}

export async function deleteAdminFromTutorial(id: string): APIResponse {
  try {
    await pbl.settings.deleteAdminTutorial(id);
    return { status: 200 };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}
