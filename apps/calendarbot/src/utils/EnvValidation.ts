import z from "zod";

const envSchema = z.object({
  DISCORD_TOKEN: z.string(),
  GOOGLE_APPLICATION_FILE: z.string(),
  POSTGRES_URL: z.string().url()
})

envSchema.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv
      extends z.infer<typeof envSchema> { }
  }
}