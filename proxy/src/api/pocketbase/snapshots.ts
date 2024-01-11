import { APIResponse, Snapshot, ListSnapshotOptions } from "@/types";
import { pbl, createDefaultErrorResponse } from "./utils";

export async function create(params: Partial<Snapshot>): APIResponse<Snapshot> {
  try {
    const snapshot = await pbl.snapshots.create(params);
    return {
      status: 200,
      data: snapshot,
    };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}

export async function list(
  options: ListSnapshotOptions,
): APIResponse<{ list: Snapshot[]; total: number }> {
  try {
    const snapshots = await pbl.snapshots.getList(options.page, options.size, {
      filter: `app="${options.app.id}"`,
      sort: "-updated,-created",
    });
    return {
      status: 200,
      data: {
        list: snapshots.items,
        total: snapshots.totalItems,
      },
    };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}

export async function get(id: string): APIResponse<Snapshot> {
  try {
    const snapshot = await pbl.snapshots.getOne(id);
    return {
      status: 200,
      data: snapshot,
    };
  } catch (e) {
    return createDefaultErrorResponse(e);
  }
}
