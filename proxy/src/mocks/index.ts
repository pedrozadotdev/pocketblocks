import applications from "./applications";
import auth from "./auth";
import configs from "./configs";
import constants from "./constants";
import folders from "./folders";
import groups from "./groups";
import organizations from "./organizations";
import users from "./users";
import VERSION from "./VERSION";

export default [
  ...applications,
  ...auth,
  ...configs,
  ...constants,
  ...folders,
  ...groups,
  ...organizations,
  ...users,
  ...VERSION,
];
