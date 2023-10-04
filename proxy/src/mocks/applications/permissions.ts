import { apps, groups, settings, users } from "@/api";
import { mocker } from "@/mocker";
import {
  createDefaultResponse,
  createDefaultErrorResponse,
  adminRoute,
} from "@/utils";
import { Application, Settings } from "@/types";

type Permission = {
  permissionId: string;
  type: "GROUP" | "USER";
  id: string;
  avatar: string;
  name: string;
  role: "editor" | "viewer";
};

async function createPermissions(app: Application): Promise<Permission[]> {
  const result: Permission[] = [];
  if (app.all_users) {
    result.push({
      permissionId: "all_users|GROUP",
      type: "GROUP",
      id: "all_users",
      avatar: "",
      name: "All Users",
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
        avatar: typeof g === "string" ? "" : await groups.getAvatarURL(g),
        name,
        role: "viewer",
      });
    }),
  );
  await Promise.all(
    app.users.map(async (u) => {
      const { id, name } = typeof u === "string" ? { id: u, name: u } : u;
      result.push({
        permissionId: `${id}|USER`,
        type: "USER",
        id,
        avatar: typeof u === "string" ? "" : await users.getAvatarURL(u),
        name,
        role: "viewer",
      });
    }),
  );
  return result;
}

async function createDefaultDataResponse(app: Application, settings: Settings) {
  const permissions = await createPermissions(app);
  return {
    orgName: settings.org_name,
    groupPermissions: permissions.filter((p) => p.type === "GROUP"),
    userPermissions: permissions.filter((p) => p.type === "USER"),
    creatorId: app.created_by
      ? typeof app.created_by === "string"
        ? app.created_by
        : app.created_by.id
      : "UNKNOWN",
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
            .filter((id) => id !== "all_users")
            .map((id) => ({ op: "ADD", type: "GROUP", id }) as const),
        ],
      };
      if (groupIds.includes("all_users")) {
        updatedApp.all_users = true;
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
      const IsAllUsers = id === "all_users|GROUP";
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
        all_users: IsAllUsers ? false : undefined,
      };
      const appResponse = await apps.update(updatedApp);
      if (appResponse.data) {
        return createDefaultResponse(true);
      }
      return createDefaultErrorResponse([appResponse]);
    }),
  ),
];
