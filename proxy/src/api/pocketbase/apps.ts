import { RecordFullListOptions } from "pocketbase";
import { Application, ListAppsFilters, User } from "@/types";
import { APIResponse, PBApplication } from "./types";
import { pb, createDefaultErrorResponse } from "./utils";

export async function list(
  filters?: ListAppsFilters,
): APIResponse<Application[]> {
  const params: RecordFullListOptions = {
    sort: "-updated,-created",
    expand: "created_by,groups,users,folder",
    filter: `status!="RECYCLED"&&${
      filters?.folderId ? `folder.id="${filters.folderId}"` : "folder=null"
    }`,
  };
  if (filters?.onlyRecycled) {
    params.filter = 'status="RECYCLED"';
  }
  try {
    const apps = await pb
      .collection("system_applications")
      .getFullList<PBApplication>(params);
    return {
      status: 200,
      data: apps.map(({ expand, ...rest }) => ({
        ...rest,
        created_by: expand?.created_by as User,
        groups: expand?.groups || [],
        users: expand?.users || [],
        folder: expand?.folder || null,
      })),
    };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}

export async function get(slug: string): APIResponse<Application> {
  try {
    const { expand, ...rest } = await pb
      .collection("system_applications")
      .getFirstListItem<PBApplication>(`slug="${slug}"`, {
        expand: "created_by,groups,users,folder",
      });
    return {
      status: 200,
      data: {
        ...rest,
        created_by: expand?.created_by as User,
        groups: expand?.groups || [],
        users: expand?.users || [],
        folder: expand?.folder || null,
      },
    };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}

export async function create(
  params: Partial<Application> & { slug: string },
): APIResponse<Application> {
  try {
    const { expand, ...rest } = await pb
      .collection("system_applications")
      .create<PBApplication>(
        { ...params, status: "NORMAL" },
        {
          expand: "created_by,groups,users,folder",
        },
      );
    return {
      status: 200,
      data: {
        ...rest,
        created_by: expand?.created_by as User,
        groups: expand?.groups || [],
        users: expand?.users || [],
        folder: expand?.folder || null,
      },
    };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}

export async function update({
  slug,
  permissions,
  ...paramsRest
}: Partial<Application> & {
  slug: string;
  permissions?: {
    op: "ADD" | "REMOVE";
    type: "USER" | "GROUP";
    id: string;
  }[];
}): APIResponse<Application> {
  try {
    const app = await pb
      .collection("system_applications")
      .getFirstListItem<PBApplication>(`slug="${slug}"`);
    const { expand, ...rest } = await pb
      .collection("system_applications")
      .update<PBApplication>(
        app.id,
        {
          ...paramsRest,
          "users+": permissions
            ?.filter((p) => p.op === "ADD" && p.type === "USER")
            .map((p) => p.id),
          "groups+": permissions
            ?.filter((p) => p.op === "ADD" && p.type === "GROUP")
            .map((p) => p.id),
          "users-": permissions
            ?.filter((p) => p.op === "REMOVE" && p.type === "USER")
            .map((p) => p.id),
          "groups-": permissions
            ?.filter((p) => p.op === "REMOVE" && p.type === "GROUP")
            .map((p) => p.id),
        },
        {
          expand: "created_by,groups,users,folder",
        },
      );
    return {
      status: 200,
      data: {
        ...rest,
        created_by: expand?.created_by as User,
        groups: expand?.groups || [],
        users: expand?.users || [],
        folder: expand?.folder || null,
      },
    };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}

export async function remove(slug: string): APIResponse {
  try {
    const app = await pb
      .collection("system_applications")
      .getFirstListItem<PBApplication>(`slug="${slug}"`);
    await pb.collection("system_applications").delete(app.id);
    return { status: 200 };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}
