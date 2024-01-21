import { auth, settings } from "@/api";
import { mocker } from "@/mocker";
import {
  adminRoute,
  createDefaultErrorResponse,
  createDefaultResponse,
} from "@/utils";

export default [
  mocker.put(
    "/api/users/mark-status",
    adminRoute(async (req) => {
      const { type } = req.config.data;
      if (type === "newUserGuidance") {
        const authResponse = await auth.getCurrentUser();
        if (!authResponse.data) {
          return createDefaultErrorResponse([{ status: 401 }]);
        }
        const updateUserResponse = await settings.deleteAdminFromTutorial(
          authResponse.data.id,
        );
        if (updateUserResponse.status === 200) {
          return createDefaultResponse();
        }
        return createDefaultErrorResponse([updateUserResponse]);
      }
      return createDefaultResponse();
    }),
  ),
];
