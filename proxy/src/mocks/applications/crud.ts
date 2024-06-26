import { apps, auth } from "@/api";
import { mocker } from "@/mocker";
import { Application } from "@/types";
import {
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

const applicationView = async ({
  params: { slug },
}: {
  params: { slug: string };
}) => {
  const appResponse = await apps.get(slug as string);
  if (appResponse.data) {
    return createDefaultResponse(
      await createFullAppResponseData(appResponse.data),
    );
  }
  return createDefaultErrorResponse([appResponse]);
};

export default [
  mocker.get("/api/v1/applications/:slug/view", applicationView),
  mocker.get("/api/v1/applications/:slug", applicationView),
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
        appDSL: JSON.stringify(editingApplicationDSL),
        editDSL: JSON.stringify(editingApplicationDSL),
        type: applicationType,
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
  mocker.post(
    "/api/v1/applications/:slug/publish",
    adminRoute(async ({ params }) => {
      const currentAppResponse = await apps.get(params.slug);
      if (currentAppResponse.data) {
        const appResponse = await apps.update({
          slug: params.slug,
          appDSL: currentAppResponse.data.editDSL,
        });
        if (appResponse.data) {
          return createDefaultResponse(
            await createFullAppResponseData(appResponse.data),
          );
        }
        return createDefaultErrorResponse([appResponse]);
      }
      return createDefaultErrorResponse([currentAppResponse]);
    }),
  ),
  mocker.put(
    "/api/applications/recycle/:slug",
    adminRoute(async (req) => {
      const updatedApp: Partial<Application> = {
        status: "RECYCLED",
      };
      const appResponse = await apps.update({
        ...updatedApp,
        slug: req.params.slug as string,
      });
      if (appResponse.data) {
        return createDefaultResponse(true);
      }
      return createDefaultErrorResponse([appResponse]);
    }),
  ),
  mocker.put(
    "/api/applications/restore/:slug",
    adminRoute(async ({ params: { slug } }) => {
      const updatedApp: Partial<Application> = {
        status: "NORMAL",
      };
      const appResponse = await apps.update({
        ...updatedApp,
        slug: slug,
      });
      if (appResponse.data) {
        return createDefaultResponse(true);
      }
      return createDefaultErrorResponse([appResponse]);
    }),
  ),
  mocker.put(
    "/api/v1/applications/:slug",
    adminRoute(async (req) => {
      const { name, editingApplicationDSL, applicationType } = req.config
        .data as Partial<Body>;
      const updatedApp: Partial<Application> = {
        name,
        editDSL: JSON.stringify(editingApplicationDSL),
        type: applicationType,
      };
      const appResponse = await apps.update({
        ...updatedApp,
        slug: req.params.slug as string,
      });
      if (appResponse.data) {
        if (
          appResponse.data.slug !== req.params.slug &&
          window.location.pathname === `/apps/${req.params.slug}/edit`
        ) {
          location.href = `${window.location.origin}/apps/${appResponse.data.slug}/edit`;
        }
        return createDefaultResponse(
          await createFullAppResponseData(appResponse.data),
        );
      }
      return createDefaultErrorResponse([appResponse]);
    }),
  ),
  mocker.put(
    "/api/applications/:slug/public-to-all",
    adminRoute(async (req) => {
      const { publicToAll } = (await req.config.data) as {
        publicToAll: boolean;
      };
      const updatedApp: Partial<Application> = {
        public: publicToAll,
      };
      const appResponse = await apps.update({
        ...updatedApp,
        slug: req.params.slug as string,
      });
      if (appResponse.data) {
        return createDefaultResponse(appResponse.data.public);
      }
      return createDefaultErrorResponse([appResponse]);
    }),
  ),
  mocker.delete(
    "/api/v1/applications/:slug",
    adminRoute(async ({ params: { slug } }) => {
      const appResponse = await apps.remove(slug as string);
      if (appResponse.status === 200) {
        return createDefaultResponse(true);
      }
      return createDefaultErrorResponse([appResponse]);
    }),
  ),
];
