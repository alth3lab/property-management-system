import { createHandler } from "@/app/api/handler";
import { getRentedUnits } from "@/services/server/home";

const handler = createHandler({
  getService: getRentedUnits,
});

export const GET = handler.GET;
