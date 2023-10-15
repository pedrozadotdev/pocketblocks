import { User } from "@/types";
import { APIResponse, PBUser } from "./types";
import { createDefaultErrorResponse, pb } from "./utils";

function getAvatarURL(user: PBUser) {
  return user.avatar
    ? `/api/files/pbl_users/${user.id}/${user.avatar}?thumb=100x100`
    : user.avatar_url ?? "";
}

export async function get(user_id: string): APIResponse<User> {
  try {
    const user = await pb
      .collection("pbl_users")
      .getFirstListItem<PBUser>(`user_id="${user_id}"`);
    return {
      status: 200,
      data: { ...user, avatar: getAvatarURL(user) },
    };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}

export async function list(): APIResponse<User[]> {
  try {
    const users = await pb.collection("pbl_users").getFullList<PBUser>();
    return {
      status: 200,
      data: users.map((u) => ({ ...u, avatar: getAvatarURL(u) })),
    };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}

export async function update({
  id,
  username,
  ...rest
}: Partial<User> & { id: string; username?: string }): APIResponse {
  try {
    await pb.collection("pbl_users").update(id, rest);
    if (pb.authStore.isAuthRecord && username) {
      await pb.collection("users").update(pb.authStore.model?.id, { username });
      await pb.collection("users").authRefresh();
    }
    return { status: 200 };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}
