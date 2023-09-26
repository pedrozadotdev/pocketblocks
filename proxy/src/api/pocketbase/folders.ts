import { Folder, User } from "@/types";
import { APIResponse, PBFolder } from "./types";
import { pb, createDefaultErrorResponse } from "./utils";

export async function list(): APIResponse<Folder[]> {
  try {
    const folders = await pb
      .collection("system_folders")
      .getFullList<PBFolder>({
        expand: "created_by",
        sort: "-updated,-created",
      });
    return {
      status: 200,
      data: folders.map(({ expand, ...rest }) => ({
        ...rest,
        created_by: expand?.created_by as User,
      })),
    };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}

export async function create(params: Partial<Folder>): APIResponse<Folder> {
  try {
    const { expand, ...rest } = await pb
      .collection("system_folders")
      .create<PBFolder>(params, {
        expand: "created_by",
      });
    return {
      status: 200,
      data: {
        ...rest,
        created_by: expand?.created_by as User,
      },
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
    const { expand, ...rest } = await pb
      .collection("system_folders")
      .update<PBFolder>(id, params, {
        expand: "created_by",
      });
    return {
      status: 200,
      data: {
        ...rest,
        created_by: expand?.created_by as User,
      },
    };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}

export async function remove(id: string): APIResponse {
  try {
    await pb.collection("system_folders").delete(id);
    return { status: 200 };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}
