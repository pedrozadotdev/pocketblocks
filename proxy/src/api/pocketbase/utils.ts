import PocketBase, { ClientResponseError } from "pocketbase";
import { APIResponse } from "./types";

export const pb = new PocketBase(window.location.origin);

pb.autoCancellation(false);

export function createDefaultErrorResponse(e: unknown): Awaited<APIResponse> {
  const { status, message } = e as ClientResponseError;
  if (status === 401) {
    return {
      status,
      message: "You cannot access this resource.",
    };
  }
  if (import.meta.env.DEV) {
    console.warn(`[POCKETBASE]: "Error: ${message}`);
  }
  return {
    status: 502,
    message: "Something went wrong.",
  };
}
