import { auth } from "@/api";
import { mocker } from "@/mocker";
import { APIResponse } from "@/types";
import { createDefaultResponse, createDefaultErrorResponse } from "@/utils";

export default [
  mocker.post("/auth/email/bind", async ({ config, messageIns }) => {
    const { email, token, password } = config.data;
    let response: Awaited<APIResponse> = {
      status: 502,
      message: "Something went wrong.",
    };
    if (email) {
      response = await auth.sendChangeEmail(email);
      messageIns.destroy();
      if (response.status === 200) {
        messageIns.info(
          "Email sent! Please visit your Mailbox and confirm your new email.",
        );
        return createDefaultResponse();
      }
    }
    if (token && password) {
      response = await auth.verifyEmailChangeToken(token, password);
      messageIns.destroy();
      if (response.status === 200) {
        messageIns.info("Email changed successfully!");
        window.history.pushState({}, document.title, window.location.pathname);
        return createDefaultResponse();
      }
    }
    messageIns.error("Something went wrong!");
    return createDefaultErrorResponse([response]);
  }),
];
