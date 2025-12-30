import { db } from "@/db";
import { bookmarkTable } from "@/db/schema/bookmark.table";
import { eq } from "drizzle-orm";

interface BookmarkParams {
  slug: string;
  title: string;
  domain: string;
  description?: string;
}

//** 북마크 생성 */
export const createBookmarks = async ({
  slug,
  title,
  domain,
  description,
}: BookmarkParams) => {
  if (!slug || !title || !domain) {
    throw new Error("Missing required fields for bookmark creation");
  }
  await db
    .insert(bookmarkTable)
    .values({
      slug: slug,
      title: title,
      domain: domain,
      description: description ?? null,
    })
    .onConflictDoNothing(); // 중복 삽입 방지
};

/** 북마크 리스트 */
export const getBookmarkBySlug = () => {
  return db.select().from(bookmarkTable);
};

/** 북마크 삭제 */
export const deleteBookmark = async (slug: string) => {
  if (!slug) {
    throw new Error("Missing slug for bookmark deletion");
  }

  await db.delete(bookmarkTable).where(eq(bookmarkTable.slug, slug));
};
