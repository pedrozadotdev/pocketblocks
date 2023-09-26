import { constants } from "@/api";

export const ADMIN_GROUP_ID = constants.ADMIN_GROUP_ID;
export const ALL_USERS_GROUP_ID = "all_users";
export const AUTH_CONFIGS = [
  {
    authType: "FORM",
    id: "EMAIL",
    enable: true,
    enableRegister: false,
    source: "EMAIL",
    sourceName: "EMAIL",
  },
];

export const ORG_ID = constants.SETTINGS_ID;
export const ORG_NAME = "Default";
