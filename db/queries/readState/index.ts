import { db } from "@/db";
import { readState } from "@/db/schema/readState.table";
import { ReadStatus } from "@/enums/readState.enum";
import { eq } from "drizzle-orm";

export function makeDocKey(domain: string, slug: string) {
  return `${domain}:${slug}`;
}

export async function getReadState(docKey: string) {
  const rows = await db
    .select()
    .from(readState)
    .where(eq(readState.docKey, docKey))
    .limit(1);
  return rows[0] ?? null;
}

export async function upsertReadState(params: {
  docKey: string;
  domain: string;
  slug: string;
  status: ReadStatus;
  lastReadAt?: number | null;
  completedAt?: number | null;
}) {
  const now = Date.now();

  await db
    .insert(readState)
    .values({
      docKey: params.docKey,
      domain: params.domain,
      slug: params.slug,
      status: params.status,
      lastReadAt: params.lastReadAt ?? null,
      completedAt: params.completedAt ?? null,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: readState.docKey,
      set: {
        status: params.status,
        lastReadAt: params.lastReadAt ?? null,
        completedAt: params.completedAt ?? null,
        updatedAt: now,
      },
    });
}

/** 문서 열면 in_progress로 (done이면 유지) */
export async function markInProgress(domain: string, slug: string) {
  const docKey = makeDocKey(domain, slug);
  const existing = await getReadState(docKey);
  const now = Date.now();

  if (existing?.status === "done") {
    await upsertReadState({
      docKey,
      domain,
      slug,
      status: "done",
      lastReadAt: now,
      completedAt: existing.completedAt ?? now,
    });
    return { docKey, status: "done" as const };
  }

  await upsertReadState({
    docKey,
    domain,
    slug,
    status: "in_progress",
    lastReadAt: now,
    completedAt: null,
  });

  return { docKey, status: "in_progress" as const };
}

/** 바닥 도달 시 done */
export async function markDone(domain: string, slug: string) {
  const docKey = makeDocKey(domain, slug);
  const now = Date.now();

  await upsertReadState({
    docKey,
    domain,
    slug,
    status: "done",
    lastReadAt: now,
    completedAt: now,
  });

  return { docKey, status: "done" as const };
}

/** 도메인별 읽음 상태 목록 (LiveQuery용) */
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
