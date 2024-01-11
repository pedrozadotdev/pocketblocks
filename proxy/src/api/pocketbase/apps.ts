import { RecordFullListOptions } from "pocketbase";
import {
  Application,
  ListAppsFilters,
  APIResponse,
  AppPermissionOp,
} from "@/types";
import { pbl, createDefaultErrorResponse } from "./utils";
import { updatePermissions } from "@/utils";

export async function list(
  filters?: ListAppsFilters,
): APIResponse<Application[]> {
  const params: RecordFullListOptions = {
    sort: "-updated,-created",
    filter: `status!="RECYCLED"&&${
      filters?.folderId ? `folder="${filters.folderId}"` : "folder=null"
    }`,
  };
  if (filters?.onlyRecycled) {
    params.filter = 'status="RECYCLED"';
  }
  try {
    const apps = await pbl.applications.getFullList(params);
    return {
      status: 200,
      data: apps,
    };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}

export async function get(slug: string): APIResponse<Application> {
  try {
    const app = await pbl.applications.getOne(slug);
    return {
      status: 200,
      data: app,
    };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}

export async function create(
  params: Partial<Application>,
): APIResponse<Application> {
  try {
    const app = await pbl.applications.create({ ...params, status: "NORMAL" });
    return {
      status: 200,
      data: app,
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
  permissions?: AppPermissionOp[];
}): APIResponse<Application> {
  try {
    const currentApp = await pbl.applications.getOne(slug);
    const app = await pbl.applications.update(slug, {
      ...paramsRest,
      ...(permissions
        ? updatePermissions(currentApp.groups, currentApp.users, permissions)
        : {}),
    });
    return {
      status: 200,
      data: app,
    };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}

export async function remove(slug: string): APIResponse {
  try {
    await pbl.applications.delete(slug);
    return { status: 200 };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}
