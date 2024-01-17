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
  allUsers: boolean;
  groups: string[];
  users: string[];
  appDSL: string;
  editDSL: string;
  folder: string | null;
}

export interface Folder extends BaseModel {
  name: string;
}

export interface Group extends BaseModel {
  name: string;
  users: string[];
}

export interface User extends BaseModel {
  username?: string;
  email?: string;
  verified?: boolean;
  name: string;
  avatar?: string;
}

type UserFieldUpdate = "username" | "email" | "password" | "name" | "avatar";

export interface Settings {
  name: string;
  logo?: string;
  icon?: string;
  headerColor?: string;
  homePage: string | null; //appId
  themes: string;
  theme: string; // id
  script?: string;
  libs?: string;
  css?: string;
  plugins?: string;
  auths: Auths;
  showTutorial: string[];
}

export type LocalAuthInfo = {
  minPasswordLength: number;
  requireEmail: boolean;
};

export type UsersInfo = {
  userFieldUpdate: UserFieldUpdate[];
  authMethods: AllowedAuths[];
  canUserSignUp: boolean;
  setupFirstAdmin: boolean;
  smtpStatus: boolean;
  localAuthInfo: LocalAuthInfo;
};

type LocalAuth = {
  label: string;
  inputMask: string;
};

export type OauthAuth = {
  customName: string;
  customIconUrl: string;
};

export type Auths = {
  local: LocalAuth;
  google: OauthAuth;
  facebook: OauthAuth;
  github: OauthAuth;
  discord: OauthAuth;
  twitter: OauthAuth;
  microsoft: OauthAuth;
  spotify: OauthAuth;
  kakao: OauthAuth;
  twitch: OauthAuth;
  strava: OauthAuth;
  gitte: OauthAuth;
  livechat: OauthAuth;
  gitea: OauthAuth;
  oidc: OauthAuth;
  oidc2: OauthAuth;
  oidc3: OauthAuth;
  apple: OauthAuth;
  instagram: OauthAuth;
  vk: OauthAuth;
  yandex: OauthAuth;
  patreon: OauthAuth;
  mailcow: OauthAuth;
};

type OauthNames = Extract<keyof Omit<Auths, "local">, string>;

type AllowedAuths = "username" | "email" | OauthNames;

export interface Snapshot extends BaseModel {
  app: string;
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
    getCurrentUser: () => APIResponse<User>;
    isLoggedIn: () => Promise<boolean>;
    isAdmin: () => Promise<boolean>;
    login: (loginId: string, password: string, provider: string) => APIResponse;
    logout: () => APIResponse;
    signup: (
      loginId: string,
      password: string,
      setupFirstAdmin?: boolean,
    ) => APIResponse;
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
    getUsersInfo: () => APIResponse<UsersInfo>;
    update: (params: Partial<Settings>) => APIResponse<Settings>;
    deleteAdminFromTutorial: (id: string) => APIResponse;
  };
  snapshots: {
    create: (params: Partial<Snapshot>) => APIResponse<Snapshot>;
    get: (id: string) => APIResponse<Snapshot>;
    list: (
      options: ListSnapshotOptions,
    ) => APIResponse<{ list: Snapshot[]; total: number }>;
  };
  users: {
    get: (id: string) => APIResponse<User>;
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

export type AppPermissionOp = {
  op: "ADD" | "REMOVE";
  type: "USER" | "GROUP";
  id: string;
};
