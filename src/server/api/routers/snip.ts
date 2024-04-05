import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { snips } from "~/server/db/schema";

const url = z.string().url();
const short = z.string();

const SnipDTO = z.object({ url, short });
const createSnipRequest = z.object({ url });
const createSnipResponse = z.object({ snip: SnipDTO });

const RandomWordResponse = z.array(z.string()).length(1);

const generateNewShort = async () => {
  const baseUrl = "https://random-word-form.herokuapp.com/random";
  const adjective = RandomWordResponse.parse(
    await (await fetch(`${baseUrl}/adjective`)).json(),
  );
  const noun = RandomWordResponse.parse(
    await (await fetch(`${baseUrl}/noun`)).json(),
  );
  return `${adjective[0]}-${noun[0]}`;
};

const getSnipRequest = z.object({ short });
const getSnipResponse = z.object({ snip: SnipDTO });

export const snipRouter = createTRPCRouter({
  create: publicProcedure
    .input(createSnipRequest)
    .output(createSnipResponse)
    .mutation(async ({ ctx, input }) => {
      const short = await generateNewShort();
      const snip = { url: input.url, short };
      await ctx.db.insert(snips).values(snip);
      return { snip };
    }),

  get: publicProcedure
    .input(getSnipRequest)
    .output(getSnipResponse)
    .query(async ({ ctx, input }) => {
      const snip = await ctx.db.query.snips.findFirst({
        where: (snip, { eq }) => eq(snip.short, input.short),
      });

      if (!snip) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }
      return { snip: { short: snip.short, url: snip.url } };
    }),
});
