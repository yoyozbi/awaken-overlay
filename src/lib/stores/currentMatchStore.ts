import { writable } from "svelte/store";
import type {Prisma} from "@prisma/client";

export const currentMatch = writable<Prisma.CurrentMatchGetPayload<{include: {team1: true; team2: true}}>>();