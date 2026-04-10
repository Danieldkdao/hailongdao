import { getGlobalTag, getIdTag, getUserTag } from "@/lib/db-cache";
import { revalidateTag } from "next/cache";

export const getMathProblemGlobalTag = () => {
  return getGlobalTag("mathProblems");
};

export const getMathProblemIdTag = (id: string) => {
  return getIdTag("mathProblems", id);
};

export const getUserMathProblemTag = (userId: string) => {
  return getUserTag("mathProblems", userId);
};

export const revalidateMathProblemCache = ({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) => {
  revalidateTag(getMathProblemGlobalTag(), { expire: 0 });
  revalidateTag(getMathProblemIdTag(id), { expire: 0 });
  revalidateTag(getUserMathProblemTag(userId), { expire: 0 });
};
