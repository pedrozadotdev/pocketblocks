import { Group } from "@/types";
import { APIResponse, PBGroup } from "./types";
import { pb, createDefaultErrorResponse } from "./utils";

export async function list(): APIResponse<Group[]> {
  try {
    const groups = await pb
      .collection("system_groups")
      .getFullList<PBGroup>({ sort: "-updated,-created" });
    return {
      status: 200,
      data: groups,
    };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}
