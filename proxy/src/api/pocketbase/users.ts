import { APIResponse, User } from "@/types";
import { createDefaultErrorResponse, pb } from "./utils";

export function getAvatarURL(user: User) {
  return user.avatar
    ? `/api/files/users/${user.id}/${user.avatar}?thumb=100x100`
    : "";
}

export async function get(id: string): APIResponse<User> {
  try {
    const user = await pb.collection("users").getOne<User>(id);
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
    const users = await pb.collection("users").getFullList<User>();
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
