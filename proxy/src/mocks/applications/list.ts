import { apps } from "@/api";
import { mocker } from "@/mocker";
import {
  authRoute,
  createAppList,
  createDefaultResponse,
  createDefaultErrorResponse,
} from "@/utils";

export default [
  mocker.get(
    "/api/applications/list",
    authRoute(async () => {
      const appsResponse = await apps.list();
      if (appsResponse.data) {
        return createDefaultResponse(await createAppList(appsResponse.data));
      }
      return createDefaultErrorResponse([appsResponse]);
    }),
  ),
];
