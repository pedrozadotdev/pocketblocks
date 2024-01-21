import { APIResponse, Folder } from "@/types";
import { pbl, createDefaultErrorResponse } from "./utils";

export async function list(): APIResponse<Folder[]> {
  try {
    const folders = await pbl.folders.getFullList({
      sort: "-updated,-created",
    });
    return {
      status: 200,
      data: folders,
    };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}

export async function create(params: Partial<Folder>): APIResponse<Folder> {
  try {
    const folder = await pbl.folders.create(params);
    return {
      status: 200,
      data: folder,
    };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}

export async function update({
  id,
  ...params
}: Partial<Folder> & { id: string }): APIResponse<Folder> {
  try {
    const folder = await pbl.folders.update(id, params);
    return {
      status: 200,
      data: folder,
    };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}

export async function remove(id: string): APIResponse {
  try {
    await pbl.folders.delete(id);
    return { status: 200 };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}
