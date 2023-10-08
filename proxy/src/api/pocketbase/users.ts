import { User } from "@/types";
import { APIResponse, PBUser } from "./types";
import { createDefaultErrorResponse, pb } from "./utils";

function getAvatarURL(user: PBUser) {
  return user.avatar_url ?? user.avatar
    ? `/api/files/pbl_users/${user.id}/${user.avatar}?thumb=100x100`
    : "";
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
  ...rest
}: Partial<User> & { id: string }): APIResponse {
  try {
    await pb.collection("pbl_users").update(id, rest);
    return { status: 200 };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}
