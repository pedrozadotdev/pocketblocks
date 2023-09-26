import { auth } from "@/api";
import { mocker } from "@/mocker";
import { createDefaultResponse } from "@/utils";

export default [
  mocker.post("/api/auth/logout", async () => {
    await auth.logout();
    return createDefaultResponse();
  }),
];
