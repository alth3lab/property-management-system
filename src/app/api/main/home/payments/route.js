import { createHandler } from "@/app/api/handler";
import { getPayments } from "@/services/server/home";

const handler = createHandler({
  getService: getPayments,
});

export const GET = handler.GET;
