import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { getCloudflareContext } from "@opennextjs/cloudflare";

function databaseUrl(): string {
  // On Cloudflare Workers the secret lives on the Worker env; locally it comes from .env.
  try {
    const env = getCloudflareContext().env as unknown as Record<string, string | undefined>;
    if (env.DATABASE_URL) return env.DATABASE_URL;
  } catch {
    // not running inside a Cloudflare request context
  }
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return url;
}

/**
 * Returns a Prisma client backed by the Neon serverless driver (Workers-compatible).
 * A new client per request is required on Workers because I/O objects can't be
 * shared across requests.
 */
export function getPrisma(): PrismaClient {
  const adapter = new PrismaNeon({ connectionString: databaseUrl() });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}
