import PocketBase, {
  ClientResponseError,
  LocalAuthStore,
  CrudService,
  CommonOptions,
} from "pocketbase";
import {
  APIResponse,
  Application,
  Folder,
  Snapshot,
  Settings,
  UsersInfo,
} from "@/types";
import { t } from "@/i18n";

const store = new LocalAuthStore("pb_admin_auth");

export const pb = new PocketBase(window.location.origin, store);

pb.autoCancellation(false);

export function createDefaultErrorResponse(e: unknown): Awaited<APIResponse> {
  const { status, message } = e as ClientResponseError;
  if (status === 401) {
    return {
      status,
      message: t("unauthorized"),
    };
  }
  if (status === 404) {
    return {
      status,
      message: t("notFound"),
    };
  }
  if (import.meta.env.DEV) {
    console.warn(`[POCKETBASE]: Error ${status}: ${message}`);
  }
  return {
    status: 502,
    message: t("serverError"),
  };
}

class PocketBlocksClient {
  readonly applications: ApplicationService;
  readonly folders: FolderService;
  readonly settings: SettingsService;
  readonly snapshots: SnapshotService;
  constructor(client: PocketBase) {
    this.applications = new ApplicationService(client);
    this.folders = new FolderService(client);
    this.settings = new SettingsService(client);
    this.snapshots = new SnapshotService(client);
  }
}

class ApplicationService extends CrudService<Application> {
  get baseCrudPath(): string {
    return "/api/pbl/applications";
  }
}

class FolderService extends CrudService<Folder> {
  get baseCrudPath(): string {
    return "/api/pbl/folders";
  }
}

class SnapshotService extends CrudService<Snapshot> {
  get baseCrudPath(): string {
    return "/api/pbl/snapshots";
  }
}

class SettingsService {
  readonly client: PocketBase;
  constructor(client: PocketBase) {
    this.client = client;
  }

  getAll(options?: CommonOptions): Promise<Settings> {
    options = Object.assign(
      {
        method: "GET",
      },
      options,
    );

    return this.client.send("/api/pbl/settings", options);
  }

  update(
    bodyParams?: Partial<Settings>,
    options?: CommonOptions,
  ): Promise<Settings> {
    options = Object.assign(
      {
        method: "PATCH",
        body: bodyParams,
      },
      options,
    );

    return this.client.send("/api/pbl/settings", options);
  }

  deleteAdminTutorial(id: string): Promise<void> {
    const options = {
      method: "DELETE",
    };

    return this.client.send(
      "/api/pbl/settings/delete-admin-tutorial/" + id,
      options,
    );
  }

  getUsersInfo(): Promise<UsersInfo> {
    const options = {
      method: "GET",
    };

    return this.client.send("/api/pbl/settings/users-info", options);
  }
}

export const pbl = new PocketBlocksClient(pb);
