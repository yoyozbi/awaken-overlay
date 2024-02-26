// lib/trpc/context.ts
import type { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone';
import type { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';
import type { inferAsyncReturnType } from '@trpc/server';

// we're not using the event parameter is this example,
// hence the eslint-disable rule
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function createContext(opts: CreateHTTPContextOptions | CreateWSSContextFnOptions) {
    return {

    }
}

export type Context = inferAsyncReturnType<typeof createContext>;
