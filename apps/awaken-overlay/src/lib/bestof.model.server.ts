import type { BestOf } from "@prisma/client";
import db from "./db.server";

export async function getBos() : Promise<BestOf[]>{
    return await db.bestOf.findMany();
}