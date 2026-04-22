import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export async function withDatabase<T>(
  operation: () => Promise<T>,
  fallback: T
): Promise<T> {
  if (!isDatabaseConfigured()) return fallback;

  try {
    return await operation();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[database fallback]", error);
    }
    return fallback;
  }
}
