import { ClientResponseError } from "pocketbase";
import { Auth, FullUser } from "@/types";
import { APIResponse, PBAuth } from "./types";
import * as users from "./users";
import { createDefaultErrorResponse, pb } from "./utils";

export async function login(
  loginId: string,
  password: string,
  provider: string,
): APIResponse {
  try {
    if (provider === "local") {
      await Promise.any([
        pb.collection("users").authWithPassword(loginId, password),
        pb.admins.authWithPassword(loginId, password),
      ]);
    } else {
      await pb.collection("users").authWithOAuth2({ provider });
    }
    return { status: 200 };
  } catch (e) {
    const { errors } = e as AggregateError;
    if (errors.some((e: ClientResponseError) => e.status === 400)) {
      return { status: 403 };
    }
    return createDefaultErrorResponse(e);
  }
}

export async function signup(loginId: string, password: string): APIResponse {
  try {
    await pb.collection("users").create({
      email: loginId,
      password,
      passwordConfirm: password,
    });
    await pb.collection("users").authWithPassword(loginId, password);
    return { status: 200 };
  } catch (e) {
    const { status } = e as ClientResponseError;
    if (status === 403) {
      return {
        status: 401,
        message: "Sign up is disabled in this organization!",
      };
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

export async function getCurrentUser(): APIResponse<FullUser> {
  const userModel = pb.authStore.model;
  if (userModel) {
    const { data } = await users.get(userModel.id);
    if (data) {
      return {
        status: 200,
        data: {
          ...data,
          email: userModel.email,
          username: userModel.username,
          verified: userModel.verified,
        },
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
        .authWithPassword(userModel.email || userModel.username, newPassword);
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

export async function getAuthMethods(): APIResponse<Auth[]> {
  try {
    const rawAuthMethods = await pb
      .collection("pbl_auth")
      .getFullList<PBAuth>();
    const authMethods = rawAuthMethods.map((m) => ({
      ...m,
      oauth_icon_url:
        m.oauth_icon_url ||
        (m.type !== "local" ? `/_/images/oauth2/${m.type}.svg` : undefined),
      oauth_custom_name:
        m.oauth_custom_name ||
        (m.type !== "local"
          ? m.type[0].toUpperCase() + m.type.slice(1)
          : undefined),
    }));
    return {
      status: 200,
      data: authMethods,
    };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}

export async function sendVerifyEmail(): APIResponse {
  try {
    const userModel = pb.authStore.model;
    if (userModel) {
      if (pb.authStore.isAuthRecord) {
        await pb.collection("users").requestVerification(userModel.email);
      }
      return { status: 200 };
    }
    return { status: 401 };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}

export async function verifyEmailToken(token: string): APIResponse {
  try {
    await pb.collection("users").confirmVerification(token);
    if (pb.authStore.isAuthRecord) {
      await pb.collection("users").authRefresh();
    }
    return { status: 200 };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}
