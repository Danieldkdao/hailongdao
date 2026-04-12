import { envServer } from "@/data/data/server";
import { db } from "@/db/db";
import { sendVerificationOtp } from "@/services/mailjet/emails/send-verification-otp";
import { ac, roles } from "@/features/user/lib/access-control";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins/email-otp";
import { admin, username } from "better-auth/plugins";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
  },
  socialProviders: {
    google: {
      clientId: envServer.GOOGLE_CLIENT_ID,
      clientSecret: envServer.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: envServer.GITHUB_CLIENT_ID,
      clientSecret: envServer.GITHUB_CLIENT_SECRET,
    },
  },
  plugins: [
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP(data) {
        await sendVerificationOtp(data);
      },
    }),
    admin({
      ac,
      roles,
    }),
    username(),
  ],
  session: {
    cookieCache: {
      maxAge: 60,
      enabled: true,
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
});
