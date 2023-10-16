import { auth } from "@/api";
import { mocker } from "@/mocker";
import { APIResponse } from "@/types";
import { createDefaultResponse, createDefaultErrorResponse } from "@/utils";
import { t } from "@/i18n";

export default [
  mocker.post("/auth/email/bind", async ({ config, messageIns }) => {
    const { email, token, password } = config.data;
    let response: Awaited<APIResponse> = {
      status: 502,
      message: t("serverError"),
    };
    if (email) {
      response = await auth.sendChangeEmail(email);
      messageIns.destroy();
      if (response.status === 200) {
        messageIns.info(t("emailChangedSent"));
        return createDefaultResponse();
      }
    }
    if (token && password) {
      response = await auth.verifyEmailChangeToken(token, password);
      messageIns.destroy();
      if (response.status === 200) {
        messageIns.info(t("emailChanged"));
        window.history.pushState({}, document.title, window.location.pathname);
        return createDefaultResponse();
      }
    }
    messageIns.error(t("serverError"));
    return createDefaultErrorResponse([response]);
  }),
];
