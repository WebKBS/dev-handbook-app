import { db } from "@/db";
import { readState } from "@/db/schema/readState.table";
import { eq } from "drizzle-orm";

export const getReadStatesByDomain = (domain: string) => {
  return db
    .select({
      domain: readState.domain,
      slug: readState.slug,
      status: readState.status,
      updatedAt: readState.updatedAt,
    })
    .from(readState)
    .where(eq(readState.domain, domain));
};
