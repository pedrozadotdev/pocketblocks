import { auth, groups } from "@/api";
import { mocker } from "@/mocker";
import { createDefaultResponse } from "@/utils";
import { t } from "@/i18n";

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
    const isAdmin = await auth.isAdmin();
    if (user) {
      const groupsResponse = await groups.list({ userId: user.id });
      return createDefaultResponse({
        ...defaultDataResponse,
        avatarUrl: user.avatar,
        id: user.id,
        name: isAdmin ? t("admin") : user.name,
        email: user.email,
        groups: groupsResponse.data
          ? groupsResponse.data.map((g) =>
              typeof g === "string"
                ? g
                : {
                    groupId: g.id,
                    groupName: g.name,
                  },
            )
          : [],
      });
    }
    return createDefaultResponse(defaultDataResponse);
  }),
];
