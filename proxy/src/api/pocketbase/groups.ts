import { Group, ListGroupsFilters } from "@/types";
import { APIResponse, PBGroup } from "./types";
import { pb, createDefaultErrorResponse } from "./utils";

export async function list(filters?: ListGroupsFilters): APIResponse<Group[]> {
  let filter: string = "";
  if (filters?.userId) {
    filter = `users.id?='${filters.userId}'`;
  }
  try {
    const groups = await pb.collection("system_groups").getFullList<PBGroup>({
      filter,
      sort: "-updated,-created",
      expand: "users",
    });
    return {
      status: 200,
      data: groups.map(({ expand, ...rest }) => ({
        ...rest,
        users: expand?.users || [],
      })),
    };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}

export async function getAvatarURL(group: Group) {
  return group.avatar
    ? `/api/files/system_groups/${group.id}/${group.avatar}?thumb=100x100`
    : "";
}
