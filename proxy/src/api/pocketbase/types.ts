import { AuthType } from "@/types";

export type { APIResponse } from "@/types";

type BaseModel<E = undefined> = {
  id: string;
  created: string;
  updated: string;
  expand?: E;
};

type ApplicationExpanded = {
  created_by: PBUser;
  groups: PBGroup[];
  users: PBUser[];
  folder: PBFolder;
};

export interface PBApplication<E = ApplicationExpanded> extends BaseModel<E> {
  name: string;
  slug: string;
  type: number;
  status: "NORMAL" | "RECYCLED";
  public: boolean;
  all_users: boolean;
  created_by: string;
  groups: string[];
  users: string[];
  app_dsl: unknown | null;
  edit_dsl: unknown | null;
  folder: string;
}

type FolderExpanded = {
  created_by: PBUser;
};

export interface PBFolder<E = FolderExpanded> extends BaseModel<E> {
  name: string;
  created_by: string;
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
  user_id: string;
  name: string;
  avatar?: string;
  avatar_url?: string;
}

type ConfigExpanded = {
  home_page: PBApplication;
};

export interface PBSettings<E = ConfigExpanded> extends BaseModel<E> {
  org_name: string;
  logo: string;
  icon: string;
  header_color: string;
  anon_template_view?: boolean;
  home_page: string | null;
  themes: string;
  theme: string; // id
  script?: string;
  libs?: string;
  css?: string;
  plugins?: string;
}

type LocalIdType = "username" | "email";

type LocalAllowUpdate = LocalIdType | "password";

export interface PBAuth extends BaseModel {
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

type SnapshotExpanded = {
  app: PBApplication;
  created_by: PBUser;
};

export interface PBSnapshot<E = SnapshotExpanded> extends BaseModel<E> {
  app: string;
  created_by: string;
  dsl: string;
  context: string;
}
