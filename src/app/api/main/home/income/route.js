import { createHandler } from "@/app/api/handler";
import { getIncome } from "@/services/server/home";

const handler = createHandler({
  getService: getIncome,
});

export const GET = handler.GET;
