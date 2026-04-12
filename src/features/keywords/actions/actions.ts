"use server";

import { db } from "@/db/db";
import { KeywordTable, MathProblemKeywordTable } from "@/db/schema";
import { cacheTag } from "next/cache";
import {
  getKeywordGlobalTag,
  revalidateKeywordCache,
} from "../db/cache/keywords";
import { eq, inArray } from "drizzle-orm";

export const getKeywords = async () => {
  "use cache";
  cacheTag(getKeywordGlobalTag());

  const keywords = await db.select().from(KeywordTable);

  return keywords;
};

export const insertMathProblemKeywords = async (
  mathProblemId: string,
  keywords: string[],
) => {
  if (!keywords.length) return;
  const existingKeywords = await db
    .select()
    .from(KeywordTable)
    .where(inArray(KeywordTable.keyword, keywords));

  let insertedKeywords: (typeof KeywordTable.$inferSelect)[] = [];

  if (existingKeywords.length < keywords.length) {
    insertedKeywords = await db
      .insert(KeywordTable)
      .values(
        keywords
          .filter((k) => !existingKeywords.map((k) => k.keyword).includes(k))
          .map((k) => ({ keyword: k })),
      )
      .returning();
  }

  const keywordsToInsert = [
    ...existingKeywords.map((k) => k.id),
    ...insertedKeywords.map((k) => k.id),
  ];

  await db
    .insert(MathProblemKeywordTable)
    .values(keywordsToInsert.map((k) => ({ keywordId: k, mathProblemId })));

  revalidateKeywordCache();
};

export const updateMathProblemKeywords = async (
  mathProblemId: string,
  keywords: string[],
) => {
  const existingKeywords = await db
    .select({
      id: KeywordTable.id,
      keyword: KeywordTable.keyword,
    })
    .from(MathProblemKeywordTable)
    .innerJoin(
      KeywordTable,
      eq(KeywordTable.id, MathProblemKeywordTable.keywordId),
    )
    .where(eq(MathProblemKeywordTable.mathProblemId, mathProblemId));

  const keywordsToInsert = [
    ...new Set(
      keywords.filter(
        (k) => !existingKeywords.map((k) => k.keyword).includes(k),
      ),
    ),
  ];
  const keywordsToDelete = [
    ...new Set(
      existingKeywords
        .filter((k) => !keywords.includes(k.keyword))
        .map((k) => k.id),
    ),
  ];

  if (keywordsToDelete.length) {
    await db
      .delete(MathProblemKeywordTable)
      .where(inArray(MathProblemKeywordTable.keywordId, keywordsToDelete));
  }

  if (keywordsToInsert.length) {
    await insertMathProblemKeywords(mathProblemId, keywordsToInsert);
  }

  revalidateKeywordCache();
};
