import { apps } from "@/api";
import { mocker } from "@/mocker";
import {
  adminRoute,
  createAppList,
  createDefaultResponse,
  createDefaultErrorResponse,
} from "@/utils";

export default [
  mocker.get(
    "/api/applications/recycle/list",
    adminRoute(async () => {
      const appsResponse = await apps.list({ onlyRecycled: true });
      if (appsResponse.data) {
        return createDefaultResponse(await createAppList(appsResponse.data));
      }
      return createDefaultErrorResponse([appsResponse]);
    }),
  ),
];
