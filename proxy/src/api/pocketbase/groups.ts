import { Group, ListGroupsFilters, APIResponse } from "@/types";
import { pb, createDefaultErrorResponse } from "./utils";

export async function list(filters?: ListGroupsFilters): APIResponse<Group[]> {
  let filter: string = "";
  if (filters?.userId) {
    filter = `users.id ?= '${filters.userId}'`;
  }
  try {
    const groups = await pb.collection("groups").getFullList<Group>({
      filter,
      sort: "-updated,-created",
    });
    return {
      status: 200,
      data: groups,
    };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}
