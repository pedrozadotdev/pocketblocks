import { apps, auth } from "@/api";
import { mocker } from "@/mocker";
import { Application } from "@/types";
import {
  authRoute,
  adminRoute,
  createDefaultErrorResponse,
  createDefaultResponse,
  createFullAppResponseData,
} from "@/utils";

type Body = {
  name: string;
  editingApplicationDSL: unknown;
  applicationType: number;
  folderId?: string;
};

export default [
  mocker.get(
    "/api/v1/applications/:id",
    authRoute(async ({ params: { id } }) => {
      const appResponse = await apps.get(id as string);
      if (appResponse.data) {
        return createDefaultResponse(
          await createFullAppResponseData(appResponse.data),
        );
      }
      return createDefaultErrorResponse([appResponse]);
    }),
  ),
  mocker.post(
    "/api/v1/applications",
    adminRoute(async (req) => {
      const { name, editingApplicationDSL, applicationType, folderId } = req
        .config.data as Body;
      const userResponse = await auth.getCurrentUser();
      if (!userResponse.data) {
        return createDefaultErrorResponse([userResponse]);
      }
      const newApp: Partial<Application> = {
        name,
        app_dsl: JSON.stringify(editingApplicationDSL),
        type: applicationType,
        created_by: userResponse.data.id,
        folder: folderId,
      };
      const appResponse = await apps.create(newApp);
      if (appResponse.data) {
        return createDefaultResponse(
          await createFullAppResponseData(appResponse.data),
        );
      }
      return createDefaultErrorResponse([appResponse]);
    }),
  ),
  mocker.put(
    "/api/applications/recycle/:id",
    adminRoute(async (req) => {
      const newApp: Partial<Application> = {
        status: "RECYCLED",
      };
      const appResponse = await apps.update({
        ...newApp,
        id: req.params.id as string,
      });
      if (appResponse.data) {
        return createDefaultResponse(true);
      }
      return createDefaultErrorResponse([appResponse]);
    }),
  ),
  mocker.put(
    "/api/applications/restore/:id",
    adminRoute(async ({ params: { id } }) => {
      const newApp: Partial<Application> = {
        status: "NORMAL",
      };
      const appResponse = await apps.update({
        ...newApp,
        id,
      });
      if (appResponse.data) {
        return createDefaultResponse(true);
      }
      return createDefaultErrorResponse([appResponse]);
    }),
  ),
  mocker.put(
    "/api/v1/applications/:id",
    adminRoute(async (req) => {
      const { name, editingApplicationDSL, applicationType } = req.config
        .data as Body;
      const newApp: Partial<Application> = {
        name,
        app_dsl: JSON.stringify(editingApplicationDSL),
        type: applicationType,
      };
      const appResponse = await apps.update({
        ...newApp,
        id: req.params.id as string,
      });
      if (appResponse.data) {
        return createDefaultResponse(
          await createFullAppResponseData(appResponse.data),
        );
      }
      return createDefaultErrorResponse([appResponse]);
    }),
  ),
  mocker.put(
    "/api/applications/:id/public-to-all",
    adminRoute(async (req) => {
      const { publicToAll } = (await req.config.data) as {
        publicToAll: boolean;
      };
      const newApp: Partial<Application> = {
        public: publicToAll,
      };
      const appResponse = await apps.update({
        ...newApp,
        id: req.params.id as string,
      });
      if (appResponse.data) {
        return createDefaultResponse(appResponse.data.public);
      }
      return createDefaultErrorResponse([appResponse]);
    }),
  ),
  mocker.delete(
    "/api/v1/applications/:id",
    adminRoute(async ({ params: { id } }) => {
      const appResponse = await apps.remove(id as string);
      if (appResponse.status === 200) {
        return createDefaultResponse(true);
      }
      return createDefaultErrorResponse([appResponse]);
    }),
  ),
];
