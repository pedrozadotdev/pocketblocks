import { Settings } from "@/types";
import { SETTINGS_ID } from "./constants";
import { APIResponse, PBSettings } from "./types";
import { pb, createDefaultErrorResponse } from "./utils";

export async function get(): APIResponse<Settings> {
  try {
    const { expand, ...rest } = await pb
      .collection("system_settings")
      .getOne<PBSettings>(SETTINGS_ID, {
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
    await pb.collection("system_settings").update(id, params);
    return { status: 200 };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}
