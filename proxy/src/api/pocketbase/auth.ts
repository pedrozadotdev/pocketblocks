import { ClientResponseError } from "pocketbase";
import { User } from "@/types";
import { ADMIN_GROUP_ID } from "./constants";
import { APIResponse } from "./types";
import { createDefaultErrorResponse, pb } from "./utils";

export async function login(loginId: string, password: string): APIResponse {
  try {
    await pb.collection("users").authWithPassword(loginId, password);
    return { status: 200 };
  } catch (e) {
    const { status } = e as ClientResponseError;
    if (status === 400) {
      return { status: 403 };
    }
    return createDefaultErrorResponse(e);
  }
}

export async function logout(): APIResponse {
  pb.authStore.clear();
  return { status: 200 };
}

export const isLoggedIn = async () => {
  return !!pb.authStore.model;
};

export const isAdmin = async () => {
  if (pb.authStore.model) {
    return pb.authStore.model.groups.some((g: unknown) => g === ADMIN_GROUP_ID);
  }
  return false;
};

export async function getCurrentUser(): APIResponse<User> {
  const userModel = pb.authStore.model;
  if (!userModel) {
    return { status: 401 };
  }
  return { status: 200 };
}

export async function getCurrentUserId(): Promise<string | null> {
  const userModel = pb.authStore.model;
  if (!userModel) {
    return null;
  }
  return userModel.id;
}

export async function changePassword(
  newPassword: string,
  oldPassword: string,
): APIResponse {
  const userModel = pb.authStore.model;
  if (!userModel) {
    return { status: 401 };
  }
  try {
    await pb.collection("users").update(userModel.id, {
      password: newPassword,
      passwordConfirm: newPassword,
      oldPassword,
    });
    await pb.collection("users").authWithPassword(userModel.email, newPassword);
    return { status: 200 };
  } catch (e) {
    const { status } = e as ClientResponseError;
    if (status === 400) {
      return { status: 403, message: "Invalid password." };
    }
    return createDefaultErrorResponse(e);
  }
}
