import { auth, groups } from "@/api";
import { ADMIN_GROUP_ID, ALL_USERS_GROUP_ID } from "@/constants";
import { mocker } from "@/mocker";
import {
  authRoute,
  createDefaultErrorResponse,
  createDefaultResponse,
} from "@/utils";

const allUsersGroup = {
  groupId: ALL_USERS_GROUP_ID,
  groupName: "All Users",
  allUsersGroup: true,
  visitorRole: "viewer",
  createTime: 0,
  dynamicRule: null,
  syncGroup: false,
  devGroup: false,
  syncDelete: false,
};

export default [
  mocker.get(
    "/api/v1/groups/list",
    authRoute(async () => {
      const groupsResponse = await groups.list();
      const currentUser = await auth.getCurrentUser();
      const isAdmin = await auth.isAdmin();
      if (groupsResponse.data && currentUser.data) {
        return createDefaultResponse([
          {
            ...allUsersGroup,
            visitorRole: isAdmin ? "admin" : "viewer",
          },
          groupsResponse.data.map((g) => ({
            ...allUsersGroup,
            groupId: g.id,
            groupName: g.name,
            allUsersGroup: false,
            visitorRole: isAdmin ? "admin" : "viewer",
            createTime: new Date(g.created).getTime(),
            devGroup: g.id === ADMIN_GROUP_ID,
          })),
        ]);
      }
      return createDefaultErrorResponse([groupsResponse, currentUser]);
    }),
  ),
];
