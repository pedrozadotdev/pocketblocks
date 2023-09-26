import { apps, auth, folders } from "@/api";
import { mocker } from "@/mocker";
import {
  authRoute,
  adminRoute,
  createAppList,
  createDefaultErrorResponse,
  createDefaultResponse,
  createFolderList,
} from "@/utils";
import { Folder } from "@/types";

export default [
  mocker.get(
    "/api/folders/elements",
    authRoute(async (req) => {
      const { id } = req.config.params;
      let result: unknown[] = [];
      if (!id) {
        const foldersResponse = await folders.list();
        if (!foldersResponse.data) {
          return createDefaultErrorResponse([foldersResponse]);
        }
        result = await createFolderList(foldersResponse.data);
      }
      const appsResponse = await apps.list(id ? { folderId: id } : undefined);
      if (appsResponse.data) {
        result = [...result, ...(await createAppList(appsResponse.data))];
        return createDefaultResponse(result);
      }
      return createDefaultErrorResponse([appsResponse]);
    }),
  ),
  mocker.post(
    "/api/folders",
    adminRoute(async (req) => {
      const { name } = req.config.data;
      const userResponse = await auth.getCurrentUser();
      if (!userResponse.data) {
        return createDefaultErrorResponse([userResponse]);
      }
      const newFolder: Partial<Folder> = {
        name,
        created_by: userResponse.data.id,
      };
      const foldersResponse = await folders.create(newFolder);
      if (foldersResponse.data) {
        return createDefaultResponse(
          (await createFolderList([foldersResponse.data]))[0],
        );
      }
      return createDefaultErrorResponse([foldersResponse]);
    }),
  ),
  mocker.put(
    "/api/folders",
    adminRoute(async (req) => {
      const { id, name } = req.config.data;
      const foldersResponse = await folders.update({ id, name });
      if (foldersResponse.data) {
        return createDefaultResponse(
          (await createFolderList([foldersResponse.data]))[0],
        );
      }
      return createDefaultErrorResponse([foldersResponse]);
    }),
  ),
  mocker.put(
    "/api/folders/move/:id",
    adminRoute(async (req) => {
      const folderId = req.config.params.targetFolderId;
      const appResponse = await apps.update({
        id: req.params.id as string,
        folder: folderId,
      });
      if (appResponse.data) {
        return createDefaultResponse();
      }
      return createDefaultErrorResponse([appResponse]);
    }),
  ),
  mocker.delete(
    "/api/folders/:id",
    adminRoute(async (req) => {
      const id = req.params.id as string;
      const foldersResponse = await folders.remove(id);
      return foldersResponse.status === 200
        ? createDefaultResponse()
        : createDefaultErrorResponse([foldersResponse]);
    }),
  ),
];
