type BaseModel = {
  id: string;
  created: string;
  updated: string;
};

export interface Application extends BaseModel {
  name: string;
  type: number;
  status: "NORMAL" | "RECYCLED";
  public: boolean;
  all_users: boolean;
  created_by: User | string;
  groups: Group[] | string[];
  users: User[] | string[];
  app_dsl: unknown | null;
  module_dsl: unknown | null;
  folder: Folder | string | null;
}

export interface Folder extends BaseModel {
  name: string;
  created_by: User | string;
}

export interface Group extends BaseModel {
  name: string;
}

export interface User extends BaseModel {
  email: string;
  name: string;
  groups: Group[] | string[];
}

export interface Settings extends BaseModel {
  home_page: Application | string | null;
  themes: string;
  theme: string; // id
  script?: string;
  libs?: string;
  css?: string;
}

export interface Snapshot extends BaseModel {
  app: Application | string;
  dsl: string;
  context: string;
}

export type APIResponse<D = undefined> = Promise<{
  status: number;
  message?: string;
  data?: D;
}>;

export type GetAppsFilters = {
  onlyRecycled?: boolean;
  folderId?: string;
};

export type API = {
  apps: {
    create: (params: Partial<Application>) => APIResponse<Application>;
    get: (id: string) => APIResponse<Application>;
    list: (filter?: GetAppsFilters) => APIResponse<Application[]>;
    remove: (id: string) => APIResponse;
    update: (
      params: Partial<Application> & { id: string },
    ) => APIResponse<Application>;
  };
  auth: {
    changePassword: (newPassword: string, oldPassword: string) => APIResponse;
    getCurrentUser: () => APIResponse<User>;
    getCurrentUserId: () => Promise<string | null>;
    isLoggedIn: () => Promise<boolean>;
    isAdmin: () => Promise<boolean>;
    login: (loginId: string, password: string) => APIResponse;
    logout: () => APIResponse;
  };
  constants: {
    ADMIN_GROUP_ID: string;
    SETTINGS_ID: string;
  };
  folders: {
    create: (params: Partial<Folder>) => APIResponse<Folder>;
    remove: (id: string) => APIResponse;
    list: () => APIResponse<Folder[]>;
    update: (params: Partial<Folder> & { id: string }) => APIResponse<Folder>;
  };
  groups: {
    list: () => APIResponse<Group[]>;
  };
  sdk: {
    client: unknown;
    setup: () => void;
  };
  settings: {
    get: () => APIResponse<Settings>;
    update: (params: Partial<Settings> & { id: string }) => APIResponse;
  };
  snapshots: unknown;
  users: {
    get: (id: string) => APIResponse<User>;
    update: (params: Partial<User> & { id: string }) => APIResponse;
  };
};
