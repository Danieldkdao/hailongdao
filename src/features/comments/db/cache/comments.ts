import { getGlobalTag, getMathProblemTag } from "@/lib/db-cache";
import { revalidateTag } from "next/cache";

export const getCommentGlobalTag = () => {
  return getGlobalTag("comments");
};

export const getMathProblemCommentTag = (mathProblemId: string) => {
  return getMathProblemTag("comments", mathProblemId);
};

export const revalidateCommentCache = (mathProblemId: string) => {
  revalidateTag(getCommentGlobalTag(), { expire: 0 });
  revalidateTag(getMathProblemCommentTag(mathProblemId), { expire: 0 });
};
