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
  users: User[] | string[];
}

export interface User extends BaseModel {
  email: string;
  name: string;
  avatar?: string;
}

export interface Settings extends BaseModel {
  org_name: string;
  logo?: string;
  icon?: string;
  header_color?: string;
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

export type listAppsFilters = {
  onlyRecycled?: boolean;
  folderId?: string;
};

export type listGroupsFilters = {
  userId: string;
};

export type API = {
  apps: {
    create: (params: Partial<Application>) => APIResponse<Application>;
    get: (id: string) => APIResponse<Application>;
    list: (filters?: listAppsFilters) => APIResponse<Application[]>;
    remove: (id: string) => APIResponse;
    update: (
      params: Partial<Application> & { id: string },
    ) => APIResponse<Application>;
  };
  auth: {
    changePassword: (newPassword: string, oldPassword: string) => APIResponse;
    getCurrentUser: () => APIResponse<User>;
    isLoggedIn: () => Promise<boolean>;
    isAdmin: () => Promise<boolean>;
    login: (loginId: string, password: string) => APIResponse;
    logout: () => APIResponse;
  };
  folders: {
    create: (params: Partial<Folder>) => APIResponse<Folder>;
    remove: (id: string) => APIResponse;
    list: () => APIResponse<Folder[]>;
    update: (params: Partial<Folder> & { id: string }) => APIResponse<Folder>;
  };
  groups: {
    list: (filters?: listGroupsFilters) => APIResponse<Group[]>;
  };
  sdk: {
    client: unknown;
    setup: () => void;
  };
  settings: {
    get: () => APIResponse<Settings>;
    getFilesURL: (
      settings: Settings,
    ) => Promise<{ logo: string; icon: string }>;
    update: (params: Partial<Settings> & { id: string }) => APIResponse;
  };
  snapshots: unknown;
  users: {
    get: (email: string) => APIResponse<User>;
    getAvatarURL: (user: User) => Promise<string>;
    update: (params: Partial<User> & { id: string }) => APIResponse;
  };
};

//Upload Avatar Types...
declare type BeforeUploadFileType = File | Blob | boolean | string;

interface UploadProgressEvent extends Partial<ProgressEvent> {
  percent?: number;
}
declare type UploadRequestMethod =
  | "POST"
  | "PUT"
  | "PATCH"
  | "post"
  | "put"
  | "patch";
declare type UploadRequestHeader = Record<string, string>;
interface UploadRequestError extends Error {
  status?: number;
  method?: UploadRequestMethod;
  url?: string;
}

interface RcFile extends File {
  uid: string;
}

export interface UploadRequestOption<T = unknown> {
  onProgress?: (event: UploadProgressEvent) => void;
  onError?: (event: UploadRequestError | ProgressEvent, body?: T) => void;
  onSuccess?: (body: T, xhr?: XMLHttpRequest) => void;
  data?: Record<string, unknown>;
  filename?: string;
  file: Exclude<BeforeUploadFileType, File | boolean> | RcFile;
  withCredentials?: boolean;
  action: string;
  headers?: UploadRequestHeader;
  method: UploadRequestMethod;
}
