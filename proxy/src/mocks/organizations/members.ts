import { users } from "@/api";
import { mocker } from "@/mocker";
import {
  adminRoute,
  createDefaultErrorResponse,
  createDefaultResponse,
} from "@/utils";

export default [
  mocker.get(
    "/api/v1/organizations/:id/members",
    adminRoute(async () => {
      const usersResponse = await users.list();
      if (usersResponse.data) {
        const members = await Promise.all(
          usersResponse.data.map(async (u) => ({
            userId: u.id,
            name: u.name,
            avatarUrl: u.avatar,
            role: "member",
            joinTime: new Date(u.created).getTime(),
            rawUserInfos: {
              EMAIL: {
                email: "PRIVATE",
              },
            },
          })),
        );
        return createDefaultResponse({
          visitorRole: "admin",
          members,
        });
      }
      return createDefaultErrorResponse([usersResponse]);
    }),
  ),
];
