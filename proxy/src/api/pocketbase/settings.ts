import { Settings } from "@/types";
import { APIResponse, PBApplication, PBSettings } from "./types";
import { pb, createDefaultErrorResponse } from "./utils";

export async function get(): APIResponse<Settings> {
  try {
    const { expand, ...rest } = await pb
      .collection("pbl_settings")
      .getFirstListItem<PBSettings>("", {
        expand: "home_page",
      });
    return {
      status: 200,
      data: {
        ...rest,
        home_page: expand?.home_page || null,
      },
    };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}

export async function update({
  id,
  ...params
}: Partial<Settings> & { id: string }) {
  try {
    if (params.home_page) {
      const { id } = await pb
        .collection("pbl_applications")
        .getFirstListItem<PBApplication>(`slug="${params.home_page}"`);
      params.home_page = id;
    }
    await pb.collection("pbl_settings").update(id, params);
    return { status: 200 };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}
