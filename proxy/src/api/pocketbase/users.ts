import { User } from "@/types";
import { APIResponse, PBUser } from "./types";
import { createDefaultErrorResponse, pb } from "./utils";

function getAvatarURL(user: PBUser) {
  return user.avatar
    ? `/api/files/users/${user.id}/${user.avatar}?thumb=100x100`
    : "";
}

export async function get(id: string): APIResponse<User> {
  try {
    const user = await pb.collection("users").getOne<PBUser>(id);
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
    const users = await pb.collection("users").getFullList<PBUser>();
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
  ...params
}: Partial<User> & { id: string }): APIResponse {
  try {
    await pb.collection("users").update(id, params);
    if (pb.authStore.isAuthRecord && params.username) {
      await pb.collection("users").authRefresh();
    }
    return { status: 200 };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}
