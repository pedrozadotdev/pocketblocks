import { User } from "@/types";
import { APIResponse, PBUser } from "./types";
import { createDefaultErrorResponse, pb } from "./utils";

export async function get(email: string): APIResponse<User> {
  try {
    const user = await pb
      .collection("system_users")
      .getFirstListItem<PBUser>(`email="${email}"`);
    return {
      status: 200,
      data: user,
    };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}

export async function list(): APIResponse<User[]> {
  try {
    const users = await pb.collection("system_users").getFullList<PBUser>();
    return {
      status: 200,
      data: users,
    };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}

export async function update({
  id,
  ...rest
}: Partial<User> & { id: string }): APIResponse {
  try {
    await pb.collection("system_users").update(id, rest);
    return { status: 200 };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}

export async function getAvatarURL(user: User) {
  return user.avatar
    ? `/api/files/system_users/${user.id}/${user.avatar}?thumb=100x100`
    : "";
}
