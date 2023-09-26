import { auth } from "@/api";
import { mocker } from "@/mocker";
import { createDefaultResponse } from "@/utils";

export default [
  mocker.post("/api/auth/form/login", async (req) => {
    const { loginId, password } = req.config.data;
    const { status } = await auth.login(loginId, password);
    if (status === 403) {
      return {
        status,
        body: {
          code: 5608,
          message: "Invalid email or password.",
          success: false,
        },
      };
    }
    return createDefaultResponse();
  }),
];
