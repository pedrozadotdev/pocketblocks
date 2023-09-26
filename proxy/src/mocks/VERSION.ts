import axios from "axios";
import { queryClient } from "@/api/cache";
import { mocker } from "@/mocker";

export default [
  mocker.get("/VERSION", async () => {
    try {
      const version = await queryClient.fetchQuery({
        queryKey: ["version"],
        queryFn: async () => {
          const result = await axios("/VERSION", { responseType: "text" });
          return result as unknown as string;
        },
      });
      return {
        status: 200,
        body: version,
      };
    } catch (error) {
      return {
        status: 503,
        body: { error },
      };
    }
  }),
];
