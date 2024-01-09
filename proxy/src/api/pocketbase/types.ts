export type { APIResponse } from "@/types";

type BaseModel<E = undefined> = {
  id: string;
  created: string;
  updated: string;
  expand?: E;
};

export interface PBApplication extends BaseModel {
  name: string;
  slug: string;
  type: number;
  status: "NORMAL" | "RECYCLED";
  public: boolean;
  allUsers: boolean;
  groups: string[];
  users: string[];
  appDSL: unknown | null;
  editDSL: unknown | null;
  folder: string;
}

export interface PBFolder extends BaseModel {
  name: string;
}

type GroupExpanded = {
  users: PBUser[];
};

export interface PBGroup<E = GroupExpanded> extends BaseModel<E> {
  name: string;
  avatar?: string;
  users: string[];
}

export interface PBUser extends BaseModel {
  name: string;
  avatar?: string;
}

export interface PBSettings extends BaseModel {
  orgName: string;
  logo: string;
  icon: string;
  headerColor: string;
  homePage: string | null;
  themes: string;
  theme: string; // id
  script?: string;
  libs?: string;
  css?: string;
  plugins?: string;
  auths: Auths;
  showTutorial: string[];
}

type LocalAuth = {
  label: string;
  inputMask: string;
};

type OauthAuth = {
  customName: string;
  customIconUrl: string;
};

type Auths = {
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

export interface PBSnapshot extends BaseModel {
  app: string;
  dsl: string;
  context: string;
}
