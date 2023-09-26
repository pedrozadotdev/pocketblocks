import { auth } from "@/api";
import { mocker } from "@/mocker";
import { createDefaultResponse } from "@/utils";

const defaultDataResponse = {
  id: "",
  name: "ANONYMOUS",
  avatarUrl: null,
  email: "",
  ip: "",
  groups: [],
  extra: {},
};

export default [
  mocker.get("/api/users/currentUser", async () => {
    const { data: user } = await auth.getCurrentUser();
    if (user) {
      return createDefaultResponse({
        ...defaultDataResponse,
        id: user.id,
        name: user.name,
        email: user.email,
        groups: user.groups.map((g) =>
          typeof g === "string"
            ? g
            : {
                groupId: g.id,
                groupName: g.name,
              },
        ),
      });
    }
    return createDefaultResponse(defaultDataResponse);
  }),
];
