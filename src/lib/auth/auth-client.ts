import { createAuthClient } from "better-auth/client";
import {
  emailOTPClient,
  inferAdditionalFields,
  organizationClient,
  adminClient,
  usernameClient,
} from "better-auth/client/plugins";
import { auth } from "./auth";

export const authClient = createAuthClient({
  plugins: [
    emailOTPClient(),
    organizationClient(),
    inferAdditionalFields<typeof auth>(),
    adminClient(),
    usernameClient(),
  ],
});
