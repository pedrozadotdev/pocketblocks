import { apps, snapshots } from "@/api";
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
            list: snapshotResponse.data.list.map(({ id, context, created }) => {
              return {
                snapshotId: id,
                context: context,
                createTime: new Date(created).getTime(),
              };
            }),
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
      if (appResponse.data) {
        const snapshotResponse = await snapshots.create({
          app: appResponse.data.id,
          context,
          dsl,
        });
        if (snapshotResponse.data) {
          return createDefaultResponse(true);
        }
        return createDefaultErrorResponse([snapshotResponse]);
      }
      return createDefaultErrorResponse([appResponse]);
    }),
  ),
];
