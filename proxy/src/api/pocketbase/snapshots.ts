import { Application, Snapshot, ListSnapshotOptions, User } from "@/types";
import { APIResponse, PBSnapshot } from "./types";
import { pb, createDefaultErrorResponse } from "./utils";

export async function create({
  app,
  created_by,
  context,
  dsl,
}: Partial<Snapshot>): APIResponse<Snapshot> {
  try {
    const { expand, ...rest } = await pb
      .collection("system_snapshots")
      .create<PBSnapshot>(
        {
          app: typeof app === "string" ? app : app?.id,
          created_by:
            typeof created_by === "string" ? created_by : created_by?.id,
          context,
          dsl,
        },
        {
          expand: "app,created_by",
        },
      );
    return {
      status: 200,
      data: {
        ...rest,
        app: expand?.app as Application,
        created_by: expand?.created_by as User,
      },
    };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}

export async function list(
  options: ListSnapshotOptions,
): APIResponse<{ list: Snapshot[]; total: number }> {
  try {
    const snapshots = await pb
      .collection("system_snapshots")
      .getList<PBSnapshot>(options.page, options.size, {
        filter: `app.id="${options.app.id}"`,
        sort: "-updated,-created",
        expand: "app,created_by",
      });
    return {
      status: 200,
      data: {
        list: snapshots.items.map(({ expand, ...rest }) => ({
          ...rest,
          app: expand?.app as Application,
          created_by: expand?.created_by as User,
        })),
        total: snapshots.totalItems,
      },
    };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}

export async function get(id: string): APIResponse<Snapshot> {
  try {
    const { expand, ...rest } = await pb
      .collection("system_snapshots")
      .getOne<PBSnapshot>(id, {
        expand: "app,created_by",
      });
    return {
      status: 200,
      data: {
        ...rest,
        app: expand?.app as Application,
        created_by: expand?.created_by as User,
      },
    };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}
