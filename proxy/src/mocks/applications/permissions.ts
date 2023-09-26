import { apps } from "@/api";
import { ADMIN_GROUP_ID, ORG_NAME } from "@/constants";
import { mocker } from "@/mocker";
import {
  authRoute,
  createDefaultResponse,
  createDefaultErrorResponse,
} from "@/utils";
import { Application } from "@/types";

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
      role: id === ADMIN_GROUP_ID ? "editor" : "viewer",
    });
  });
  app.users.forEach((u) => {
    const { id, name } = typeof u === "string" ? { id: u, name: u } : u;
    result.push({
      permissionId: id,
      type: "USER",
      id,
      avatar: "",
      name,
      role:
        typeof u === "string"
          ? "viewer"
          : u.groups.some(
              (g) => (typeof g === "string" ? g : g.id) === ADMIN_GROUP_ID,
            )
          ? "editor"
          : "viewer",
    });
  });
  return result;
}

function createDefaultDataResponse(app: Application) {
  const permissions = createPermissions(app);
  return {
    orgName: ORG_NAME,
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
      if (appResponse.data) {
        return createDefaultResponse(
          createDefaultDataResponse(appResponse.data),
        );
      }
      return createDefaultErrorResponse([appResponse]);
    }),
  ),
];
