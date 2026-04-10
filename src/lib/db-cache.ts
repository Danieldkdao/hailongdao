type CacheTag = "users" | "mathProblems";

export const getGlobalTag = (tag: CacheTag) => {
  return `global:${tag}`;
};

export const getUserTag = (tag: CacheTag, id: string) => {
  return `user:${id}-${tag}`;
};

export const getIdTag = (tag: CacheTag, id: string) => {
  return `id:${id}-${tag}`;
};
