import { apps, settings, users } from "@/api";
import { ALL_USERS_GROUP_ID } from "@/constants";
import { mocker } from "@/mocker";
import {
  createDefaultResponse,
  createDefaultErrorResponse,
  adminRoute,
} from "@/utils";
import { Application, Settings } from "@/types";
import { t } from "@/i18n";

type Permission = {
  permissionId: string;
  type: "GROUP" | "USER";
  id: string;
  avatar?: string;
  name: string;
  role: "editor" | "viewer";
};

async function createPermissions(app: Application): Promise<Permission[]> {
  const result: Permission[] = [];
  if (app.allUsers) {
    result.push({
      permissionId: `${ALL_USERS_GROUP_ID}|GROUP`,
      type: "GROUP",
      id: ALL_USERS_GROUP_ID,
      avatar: "",
      name: t("allUsers"),
      role: "viewer",
    });
  }
  await Promise.all(
    app.groups.map(async (g) => {
      const { id, name } = typeof g === "string" ? { id: g, name: g } : g;
      result.push({
        permissionId: `${id}|GROUP`,
        type: "GROUP",
        id,
        name,
        role: "viewer",
      });
    }),
  );
  await Promise.all(
    app.users.map(async (u) => {
      const userResponse = await users.get(u);
      if (userResponse.data) {
        result.push({
          permissionId: `${u}|USER`,
          type: "USER",
          id: u,
          avatar: userResponse.data.avatar,
          name: userResponse.data.name,
          role: "viewer",
        });
      }
    }),
  );
  return result;
}

async function createDefaultDataResponse(app: Application, settings: Settings) {
  const permissions = await createPermissions(app);
  return {
    orgName: settings.orgName,
    groupPermissions: permissions.filter((p) => p.type === "GROUP"),
    userPermissions: permissions.filter((p) => p.type === "USER"),
    publicToAll: app.public,
    permissions,
  };
}

export default [
  mocker.get(
    "/api/v1/applications/:slug/permissions",
    adminRoute(async ({ params: { slug } }) => {
      const appResponse = await apps.get(slug as string);
      const settingsResponse = await settings.get();
      if (appResponse.data && settingsResponse.data) {
        return createDefaultResponse(
          await createDefaultDataResponse(
            appResponse.data,
            settingsResponse.data,
          ),
        );
      }
      return createDefaultErrorResponse([appResponse, settingsResponse]);
    }),
  ),
  mocker.put(
    "/api/v1/applications/:slug/permissions",
    adminRoute(async (req) => {
      const { userIds, groupIds } = (await req.config.data) as {
        userIds: string[];
        groupIds: string[];
      };
      const updatedApp: Parameters<typeof apps.update>[0] = {
        slug: req.params.slug as string,
        permissions: [
          ...userIds.map((id) => ({ op: "ADD", type: "USER", id }) as const),
          ...groupIds
            .filter((id) => id !== ALL_USERS_GROUP_ID)
            .map((id) => ({ op: "ADD", type: "GROUP", id }) as const),
        ],
      };
      if (groupIds.includes(ALL_USERS_GROUP_ID)) {
        updatedApp.allUsers = true;
      }
      const appResponse = await apps.update(updatedApp);
      if (appResponse.data) {
        return createDefaultResponse(true);
      }
      return createDefaultErrorResponse([appResponse]);
    }),
  ),
  mocker.delete(
    "/api/v1/applications/:slug/permissions/:id",
    adminRoute(async (req) => {
      const { slug, id } = req.params as { slug: string; id: string };
      const IsAllUsers = id === `${ALL_USERS_GROUP_ID}|GROUP`;
      const [memberId, type] = id.split("|");
      const updatedApp: Parameters<typeof apps.update>[0] = {
        slug,
        permissions: IsAllUsers
          ? undefined
          : [
              {
                op: "REMOVE",
                type: type.toUpperCase() as "USER" | "GROUP",
                id: memberId,
              },
            ],
        allUsers: IsAllUsers ? false : undefined,
      };
      const appResponse = await apps.update(updatedApp);
      if (appResponse.data) {
        return createDefaultResponse(true);
      }
      return createDefaultErrorResponse([appResponse]);
    }),
  ),
];
