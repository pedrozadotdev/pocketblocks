type BaseModel = {
  id: string;
  created: string;
  updated: string;
};

export interface Application extends BaseModel {
  name: string;
  slug: string;
  type: number;
  status: "NORMAL" | "RECYCLED";
  public: boolean;
  all_users: boolean;
  created_by?: User | string;
  groups: Group[] | string[];
  users: User[] | string[];
  app_dsl: unknown | null;
  edit_dsl: unknown | null;
  folder: Folder | string | null;
}

export interface Folder extends BaseModel {
  name: string;
  created_by: User | string;
}

export interface Group extends BaseModel {
  name: string;
  avatar?: string;
  users: User[] | string[];
}

export interface User extends BaseModel {
  user_id: string;
  name: string;
  avatar?: string;
}

export interface FullUser extends User {
  username?: string;
  email?: string;
  verified?: boolean;
}

export interface Settings extends BaseModel {
  org_name: string;
  logo?: string;
  icon?: string;
  header_color?: string;
  anon_template_view?: boolean;
  home_page: Application | string | null;
  themes: string;
  theme: string; // id
  script?: string;
  libs?: string;
  css?: string;
}

export type AuthType =
  | "local"
  | "google"
  | "facebook"
  | "github"
  | "gitlab"
  | "discord"
  | "twitter"
  | "microsoft"
  | "spotify"
  | "kakao"
  | "twitch"
  | "strava"
  | "gitee"
  | "livechat"
  | "gitea"
  | "oidc"
  | "oidc2"
  | "oidc3"
  | "apple"
  | "instagram"
  | "vk"
  | "yandex";

type LocalIdType = "username" | "email";

type LocalAllowUpdate = LocalIdType | "password";

export interface Auth extends BaseModel {
  type: AuthType;
  local_id_label?: string;
  local_id_input_mask?: string;
  local_id_type?: LocalIdType[];
  local_allow_update?: LocalAllowUpdate[];
  local_email_auto_verified?: boolean;
  oauth_custom_name?: string;
  oauth_icon_url?: string;
  allow_signup: boolean;
}

export interface Snapshot extends BaseModel {
  app: Application | string;
  created_by: User | string;
  dsl: string;
  context: string;
}

export type APIResponse<D = undefined> = Promise<{
  status: number;
  message?: string;
  data?: D;
}>;

export type ListAppsFilters = {
  onlyRecycled?: boolean;
  folderId?: string;
};

export type ListGroupsFilters = {
  userId: string;
};

export type ListSnapshotOptions = {
  app: Application;
  page: number;
  size: number;
};

export type API = {
  apps: {
    create: (params: Partial<Application>) => APIResponse<Application>;
    get: (slug: string) => APIResponse<Application>;
    list: (filters?: ListAppsFilters) => APIResponse<Application[]>;
    remove: (slug: string) => APIResponse;
    update: (
      params: Partial<Application> & {
        slug: string;
        permissions?: {
          op: "ADD" | "REMOVE";
          type: "USER" | "GROUP";
          id: string;
        }[];
      },
    ) => APIResponse<Application>;
  };
  auth: {
    changePassword: (newPassword: string, oldPassword: string) => APIResponse;
    getCurrentUser: () => APIResponse<FullUser>;
    getAuthMethods: () => APIResponse<Auth[]>;
    isLoggedIn: () => Promise<boolean>;
    isAdmin: () => Promise<boolean>;
    login: (loginId: string, password: string, provider: string) => APIResponse;
    logout: () => APIResponse;
    signup: (loginId: string, password: string) => APIResponse;
    verifyEmailToken: (token: string) => APIResponse;
    verifyEmailChangeToken: (token: string, password: string) => APIResponse;
    sendChangeEmail: (email: string) => APIResponse;
    sendVerifyEmail: () => APIResponse;
    sendPasswordReset: (email: string) => APIResponse;
    confirmPasswordReset: (token: string, password: string) => APIResponse;
  };
  folders: {
    create: (params: Partial<Folder>) => APIResponse<Folder>;
    remove: (id: string) => APIResponse;
    list: () => APIResponse<Folder[]>;
    update: (params: Partial<Folder> & { id: string }) => APIResponse<Folder>;
  };
  groups: {
    list: (filters?: ListGroupsFilters) => APIResponse<Group[]>;
  };
  sdk: {
    client: unknown;
    setup: () => void;
  };
  settings: {
    get: () => APIResponse<Settings>;
    update: (params: Partial<Settings> & { id: string }) => APIResponse;
  };
  snapshots: {
    create: (params: Partial<Snapshot>) => APIResponse<Snapshot>;
    get: (id: string) => APIResponse<Snapshot>;
    list: (
      options: ListSnapshotOptions,
    ) => APIResponse<{ list: Snapshot[]; total: number }>;
  };
  users: {
    get: (user_id: string) => APIResponse<User>;
    list: () => APIResponse<User[]>;
    update: (
      params: Partial<User> & { id: string; username?: string },
    ) => APIResponse;
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
export interface UploadRequestError extends Error {
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
