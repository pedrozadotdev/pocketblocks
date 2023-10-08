import PocketBase, { ClientResponseError, LocalAuthStore } from "pocketbase";
import { APIResponse } from "./types";

const store = new LocalAuthStore("pb_admin_auth");

export const pb = new PocketBase(window.location.origin, store);

pb.autoCancellation(false);

export function createDefaultErrorResponse(e: unknown): Awaited<APIResponse> {
  const { status, message } = e as ClientResponseError;
  if (status === 401) {
    return {
      status,
      message: "You cannot access this resource.",
    };
  }
  if (status === 404) {
    return {
      status,
      message: "Resource not found",
    };
  }
  if (import.meta.env.DEV) {
    console.warn(`[POCKETBASE]: Error ${status}: ${message}`);
  }
  return {
    status: 502,
    message: "Something went wrong.",
  };
}
