import { auth } from "@/api";
import { mocker } from "@/mocker";
import { APIResponse } from "@/types";
import { createDefaultResponse, createDefaultErrorResponse } from "@/utils";

export default [
  mocker.post("/api/auth/form/login", async ({ config, messageIns }) => {
    const { loginId, password, register, source, authId, resetToken } =
      config.data;
    let authResponse: Awaited<APIResponse> = {
      status: 502,
      message: "Something went wrong!",
    };
    if (authId === "RESET_PASSWORD") {
      if (resetToken) {
        authResponse = await auth.confirmPasswordReset(resetToken, password);
      } else {
        authResponse = await auth.sendPasswordReset(loginId);
      }
    } else {
      authResponse = await auth[register ? "signup" : "login"](
        loginId,
        password,
        source === "EMAIL" ? "local" : (source as string),
      );
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
    }
    if (authResponse.status === 200) {
      return new Promise((res) => {
        if (authId === "RESET_PASSWORD") {
          messageIns.destroy();
          messageIns.success(
            resetToken
              ? "Password reset successfully!"
              : "Email sent! Please visit your Mailbox and reset your password.",
          );
          setTimeout(() => res(createDefaultResponse()), 2000);
        } else {
          res(createDefaultResponse());
        }
      });
    }
    return createDefaultErrorResponse([authResponse]);
  }),
];
