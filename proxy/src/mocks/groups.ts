import { auth, groups } from "@/api";
import { ALL_USERS_GROUP_ID } from "@/constants";
import { mocker } from "@/mocker";
import { createDefaultErrorResponse, createDefaultResponse } from "@/utils";
import { t } from "@/i18n";

export default [
  mocker.get("/api/v1/groups/list", async () => {
    const allUsersGroup = {
      groupId: ALL_USERS_GROUP_ID,
      groupName: t("allUsers"),
      allUsersGroup: true,
      visitorRole: "viewer",
      createTime: 0,
      dynamicRule: null,
      syncGroup: false,
      devGroup: false,
      syncDelete: false,
    };
    const groupsResponse = await groups.list();
    const isAdmin = await auth.isAdmin();
    if (groupsResponse.data) {
      return createDefaultResponse([
        {
          ...allUsersGroup,
          visitorRole: isAdmin ? "admin" : "viewer",
        },
        ...(await Promise.all(
          groupsResponse.data.map(async (g) => ({
            ...allUsersGroup,
            groupId: g.id,
            groupName: g.name,
            avatarUrl: g.avatar,
            allUsersGroup: false,
            visitorRole: isAdmin ? "admin" : "viewer",
            createTime: new Date(g.created).getTime(),
            devGroup: false,
          })),
        )),
      ]);
    }
    return createDefaultErrorResponse([groupsResponse]);
  }),
];
