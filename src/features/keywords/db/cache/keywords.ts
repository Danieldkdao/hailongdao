import { getGlobalTag } from "@/lib/db-cache";
import { revalidateTag } from "next/cache";

export const getKeywordGlobalTag = () => {
  return getGlobalTag("keywords");
};

export const revalidateKeywordCache = () => {
  revalidateTag(getKeywordGlobalTag(), { expire: 0 });
};
