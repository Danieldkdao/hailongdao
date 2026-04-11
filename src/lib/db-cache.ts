type CacheTag = "users" | "mathProblems" | "comments";

export const getGlobalTag = (tag: CacheTag) => {
  return `global:${tag}`;
};

export const getUserTag = (tag: CacheTag, id: string) => {
  return `user:${id}-${tag}`;
};

export const getMathProblemTag = (tag: CacheTag, id: string) => {
  return `mathProblem:${id}-${tag}`;
};

export const getIdTag = (tag: CacheTag, id: string) => {
  return `id:${id}-${tag}`;
};
