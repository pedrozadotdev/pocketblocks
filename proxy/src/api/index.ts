import * as pocketbase from "./pocketbase";
import { applyAPICache } from "./cache";

export const {
  apps,
  auth,
  constants,
  folders,
  groups,
  sdk,
  settings,
  snapshots,
  users,
} = applyAPICache(pocketbase);
