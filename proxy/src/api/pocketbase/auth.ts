import { ClientResponseError } from "pocketbase";
import { User } from "@/types";
import { APIResponse } from "./types";
import * as users from "./users";
import { createDefaultErrorResponse, pb } from "./utils";

export async function login(loginId: string, password: string): APIResponse {
  try {
    await Promise.any([
      pb.collection("users").authWithPassword(loginId, password),
      pb.admins.authWithPassword(loginId, password),
    ]);
    return { status: 200 };
  } catch (e) {
    const { errors } = e as AggregateError;
    if (errors.some((e: ClientResponseError) => e.status === 400)) {
      return { status: 403 };
    }
    return createDefaultErrorResponse(e);
  }
}

export async function logout(): APIResponse {
  pb.authStore.clear();
  return { status: 200 };
}

export const isLoggedIn = async () => pb.authStore.isValid;

export const isAdmin = async () => pb.authStore.isAdmin;

export async function getCurrentUser(): APIResponse<User> {
  const userModel = pb.authStore.model;
  if (userModel) {
    const { data } = await users.get(userModel.email);
    if (data) {
      return {
        status: 200,
        data,
      };
    }
  }
  return { status: 401 };
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
    if (pb.authStore.isAdmin) {
      await pb.admins.update(userModel.id, {
        password: newPassword,
        passwordConfirm: newPassword,
      });
      await pb.admins.authWithPassword(userModel.email, newPassword);
    } else {
      await pb.collection("users").update(userModel.id, {
        password: newPassword,
        passwordConfirm: newPassword,
        oldPassword,
      });
      await pb
        .collection("users")
        .authWithPassword(userModel.email, newPassword);
    }
    return { status: 200 };
  } catch (e) {
    const { status } = e as ClientResponseError;
    if (status === 400) {
      return { status: 403, message: "Invalid password." };
    }
    return createDefaultErrorResponse(e);
  }
}
