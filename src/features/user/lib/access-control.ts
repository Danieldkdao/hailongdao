import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements,
  userAc,
} from "better-auth/plugins/admin/access";

const mathProblemStatements = [
  "create",
  "read",
  "update",
  "delete",
  "read-all",
  "update-all",
  "delete-all",
] as const;

const statements = {
  ...defaultStatements,
  mathProblem: mathProblemStatements,
} as const;

export const ac = createAccessControl(statements);

export const roles = {
  admin: ac.newRole({
    ...adminAc.statements,
    mathProblem: [...mathProblemStatements],
  }),
  contributor: ac.newRole({
    ...userAc.statements,
    mathProblem: ["create", "read", "update", "delete"],
  }),
  user: ac.newRole({
    ...userAc.statements,
    mathProblem: [],
  }),
} as const;

export type AppPermissions = {
  [Resource in keyof typeof statements]?: (typeof statements)[Resource][number][];
};
