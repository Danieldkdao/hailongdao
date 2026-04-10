import { getGlobalTag, getIdTag } from "@/lib/db-cache";
import { revalidateTag } from "next/cache";

export const getUserGlobalTag = () => {
  return getGlobalTag("users");
};

export const getUserIdTag = (userId: string) => {
  return getIdTag("users", userId);
};

export const revalidateUserCache = (userId: string) => {
  revalidateTag(getUserGlobalTag(), { expire: 0 });
  revalidateTag(getUserIdTag(userId), { expire: 0 });
};
