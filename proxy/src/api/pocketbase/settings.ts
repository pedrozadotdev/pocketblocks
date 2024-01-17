import { Settings, APIResponse, UsersInfo } from "@/types";
import { pbl, createDefaultErrorResponse } from "./utils";

export async function get(): APIResponse<Settings> {
  try {
    const settings = await pbl.settings.getAll();
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
