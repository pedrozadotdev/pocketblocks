import { apps, auth, snapshots } from "@/api";
import { mocker } from "@/mocker";
import {
  adminRoute,
  createDefaultErrorResponse,
  createDefaultResponse,
} from "@/utils";

type Body = {
  applicationId: string;
  context: string;
  dsl: string;
};

export default [
  mocker.get(
    "/api/application/history-snapshots/:appSlug/:id",
    adminRoute(async ({ params }) => {
      const snapshotResponse = await snapshots.get(params.id as string);
      if (snapshotResponse.data) {
        return createDefaultResponse({
          applicationsDsl: snapshotResponse.data.dsl,
          moduleDSL: {},
        });
      }
      return createDefaultErrorResponse([snapshotResponse]);
    }),
  ),
  mocker.get(
    "/api/application/history-snapshots/:appSlug",
    adminRoute(async (req) => {
      const appResponse = await apps.get(req.params.appSlug);
      if (appResponse.data) {
        const snapshotResponse = await snapshots.list({
          app: appResponse.data,
          page: req.config.params.page,
          size: req.config.params.size,
        });
        if (snapshotResponse.data) {
          return createDefaultResponse({
            list: await Promise.all(
              snapshotResponse.data.list.map(
                async ({ id, context, created, created_by }) => {
                  const { userId, userName, userAvatar } =
                    typeof created_by === "string"
                      ? {
                          userId: created_by,
                          userName: created_by,
                          userAvatar: "",
                        }
                      : {
                          userId: created_by.id,
                          userName: created_by.name,
                          userAvatar: created_by.avatar,
                        };
                  return {
                    snapshotId: id,
                    context: context,
                    userId,
                    userName,
                    userAvatar,
                    createTime: new Date(created).getTime(),
                  };
                },
              ),
            ),
            count: snapshotResponse.data.total,
          });
        }
        return createDefaultErrorResponse([snapshotResponse]);
      }
      return createDefaultErrorResponse([appResponse]);
    }),
  ),
  mocker.post(
    "/api/application/history-snapshots",
    adminRoute(async (req) => {
      const { applicationId: slug, context, dsl } = req.config.data as Body;
      const appResponse = await apps.get(slug);
      const currentUserResponse = await auth.getCurrentUser();
      if (appResponse.data && currentUserResponse.data) {
        const snapshotResponse = await snapshots.create({
          app: appResponse.data,
          created_by: currentUserResponse.data,
          context,
          dsl,
        });
        if (snapshotResponse.data) {
          return createDefaultResponse(true);
        }
        return createDefaultErrorResponse([snapshotResponse]);
      }
      return createDefaultErrorResponse([appResponse, currentUserResponse]);
    }),
  ),
];
