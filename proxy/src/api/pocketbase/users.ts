import { User } from "@/types";
import { APIResponse, PBUser } from "./types";
import { createDefaultErrorResponse, pb } from "./utils";

export async function get(id: string): APIResponse<User> {
  try {
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      username,
      expand,
      ...rest
    } = await pb.collection("users").getOne<PBUser>(id, {
      expand: "groups",
    });
    return {
      status: 200,
      data: {
        ...rest,
        groups: expand?.groups || [],
      },
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
    await pb.collection("users").update(id, rest);
    return { status: 200 };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}
