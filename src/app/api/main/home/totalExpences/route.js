import { createHandler } from "@/app/api/handler";
import { getExpenses, getTotalExpenses } from "@/services/server/home";

const handler = createHandler({
  getService: getTotalExpenses,
});

export const GET = handler.GET;
