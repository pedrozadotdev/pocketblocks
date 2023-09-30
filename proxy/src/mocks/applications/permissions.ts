import { apps, settings } from "@/api";
import { mocker } from "@/mocker";
import {
  authRoute,
  createDefaultResponse,
  createDefaultErrorResponse,
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

function createPermissions(app: Application): Permission[] {
  const result: Permission[] = [];
  app.groups.forEach((g) => {
    const { id, name } = typeof g === "string" ? { id: g, name: g } : g;
    result.push({
      permissionId: id,
      type: "GROUP",
      id,
      avatar: "",
      name,
      role: "viewer",
    });
  });
  app.users.forEach((u) => {
    const { id, name } = typeof u === "string" ? { id: u, name: u } : u;
    result.push({
      permissionId: id,
      type: "USER",
      id,
      avatar: typeof u === "string" ? "" : u.avatar ?? "",
      name,
      role: "viewer",
    });
  });
  return result;
}

function createDefaultDataResponse(app: Application, settings: Settings) {
  const permissions = createPermissions(app);
  return {
    orgName: settings.org_name,
    groupPermissions: permissions.filter((p) => p.type === "GROUP"),
    userPermissions: permissions.filter((p) => p.type === "USER"),
    creatorId:
      typeof app.created_by === "string" ? app.created_by : app.created_by.id,
    publicToAll: app.public,
    permissions,
  };
}

export default [
  mocker.get(
    "/api/v1/applications/:id/permissions",
    authRoute(async ({ params: { id } }) => {
      const appResponse = await apps.get(id as string);
      const settingsResponse = await settings.get();
      if (appResponse.data && settingsResponse.data) {
        return createDefaultResponse(
          createDefaultDataResponse(appResponse.data, settingsResponse.data),
        );
      }
      return createDefaultErrorResponse([appResponse, settingsResponse]);
    }),
  ),
];
