import { createHandler } from "@/app/api/handler";
import { getNonRentedUnits } from "@/services/server/home";

const handler = createHandler({
  getService: getNonRentedUnits,
});

export const GET = handler.GET;
