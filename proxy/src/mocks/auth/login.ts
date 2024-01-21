import { auth, settings } from "@/api";
import { mocker } from "@/mocker";
import { APIResponse } from "@/types";
import { createDefaultResponse, createDefaultErrorResponse } from "@/utils";
import { t } from "@/i18n";

export default [
  mocker.post("/api/auth/form/login", async ({ config, messageIns }) => {
    const { loginId, password, register, source, authId, resetToken } =
      config.data;
    let authResponse: Awaited<APIResponse> = {
      status: 502,
      message: t("serverError"),
    };
    if (authId === "RESET_PASSWORD") {
      if (resetToken) {
        authResponse = await auth.confirmPasswordReset(resetToken, password);
      } else {
        authResponse = await auth.sendPasswordReset(loginId);
      }
    } else {
      if (register) {
        const usersInfoResponse = await settings.getUsersInfo();
        authResponse = await auth.signup(
          loginId,
          password,
          usersInfoResponse.data?.setupFirstAdmin,
        );
      } else {
        authResponse = await auth.login(
          loginId,
          password,
          source === "EMAIL" ? "local" : (source as string),
        );
      }
      if (authResponse.status === 403) {
        return {
          status: 403,
          body: {
            code: 5608,
            message: t("authInvalid"),
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
            resetToken ? t("passwordReset") : t("passwordResetSent"),
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
