import { auth } from "@/api";
import { mocker } from "@/mocker";
import { createDefaultResponse, createDefaultErrorResponse } from "@/utils";

export default [
  mocker.post("/api/auth/form/login", async (req) => {
    const { loginId, password, register } = req.config.data;
    const authResponse = await auth[register ? "signup" : "login"](
      loginId,
      password,
    );
    if (authResponse.status === 200) {
      return createDefaultResponse();
    }
    if (authResponse.status === 403) {
      return {
        status: 403,
        body: {
          code: 5608,
          message: "Invalid email/username or password.",
          success: false,
        },
      };
    }
    return createDefaultErrorResponse([authResponse]);
  }),
];
