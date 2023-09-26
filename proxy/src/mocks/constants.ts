import { mocker, MockResponse } from "@/mocker";

const responseData: MockResponse = {
  status: 200,
  body: { code: 1, message: "", data: [], success: true },
};

export default [
  mocker.get("/api/misc/js-library/recommendations", async () => responseData),
  mocker.get("/api/misc/js-library/metas", async () => responseData),
  mocker.get(
    "/api/v1/organizations/:orgId/datasourceTypes",
    async () => responseData,
  ),
  mocker.get(
    "/api/v1/datasources/listByApp\\?appId=:id",
    async () => responseData,
  ),
  mocker.get("/api/library-queries/dropDownList", async () => responseData),
  mocker.get(
    "/api/v1/datasources/jsDatasourcePlugins\\?appId=:id",
    async () => responseData,
  ),
];
