import { createHandler } from "@/app/api/handler";
import { getExpenses } from "@/services/server/home";

const handler = createHandler({
  getService: getExpenses,
});

export const GET = handler.GET;
