import { RecordFullListOptions } from "pocketbase";
import { Application, listAppsFilters, User } from "@/types";
import { APIResponse, PBApplication } from "./types";
import { pb, createDefaultErrorResponse } from "./utils";

export async function list(
  filters?: listAppsFilters,
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

export async function get(id: string): APIResponse<Application> {
  try {
    const { expand, ...rest } = await pb
      .collection("system_applications")
      .getOne<PBApplication>(id, { expand: "created_by,groups,users,folder" });
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
  params: Partial<Application>,
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

export async function update(
  params: Partial<Application> & { id: string },
): APIResponse<Application> {
  try {
    const { expand, ...rest } = await pb
      .collection("system_applications")
      .update<PBApplication>(params.id, params, {
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

export async function remove(id: string): APIResponse {
  try {
    await pb.collection("system_applications").delete(id);
    return { status: 200 };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}
