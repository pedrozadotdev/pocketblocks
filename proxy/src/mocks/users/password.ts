import { auth } from "@/api";
import { mocker } from "@/mocker";
import {
  authRoute,
  createDefaultErrorResponse,
  createDefaultResponse,
} from "@/utils";

export default [
  mocker.put(
    "/api/v1/users/password",
    authRoute(async (req) => {
      const { newPassword, oldPassword } = req.config.data;
      const userResponse = await auth.changePassword(newPassword, oldPassword);
      if (userResponse.status === 200) {
        return createDefaultResponse();
      }
      return createDefaultErrorResponse([userResponse]);
    }),
  ),
];
