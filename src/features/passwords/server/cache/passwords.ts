import { getGlobalTag } from "@/lib/db-cache";
import { revalidateTag } from "next/cache";

export const getGlobalPasswordTag = () => {
  return getGlobalTag("passwords");
};

export const revalidatePasswordCache = () => {
  revalidateTag(getGlobalPasswordTag(), { expire: 0 });
};
