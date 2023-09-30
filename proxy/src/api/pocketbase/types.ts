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
  type: number;
  status: "NORMAL" | "RECYCLED";
  public: boolean;
  all_users: boolean;
  created_by: string;
  groups: string[];
  users: string[];
  app_dsl: unknown | null;
  module_dsl: unknown | null;
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
  users: string[];
}

export interface PBUser extends BaseModel {
  email: string;
  name: string;
  avatar?: string;
}

type ConfigExpanded = {
  home_page: PBApplication;
};

export interface PBSettings<E = ConfigExpanded> extends BaseModel<E> {
  org_name: string;
  logo: string;
  icon: string;
  header_color: string;
  home_page: string | null;
  themes: string;
  theme: string; // id
  script?: string;
  libs?: string;
  css?: string;
}

type SnapshotExpanded = {
  app: PBApplication;
};

export interface PBSnapshot<E = SnapshotExpanded> extends BaseModel<E> {
  app: string;
  dsl: string;
  context: string;
}
