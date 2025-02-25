import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@pollify/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { routes } from "../../../config/routes";
import { defaultCookies } from "../../../lib/default-cookies";

const isSecure = process.env.NODE_ENV === "production";

export const getAuthOptions = (req: NextApiRequest): NextAuthOptions => ({
  adapter: PrismaAdapter(prisma),
  cookies: defaultCookies(isSecure),
  useSecureCookies: isSecure,
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_ID,
      clientSecret: process.env.GOOGLE_OAUTH_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Enter your email address...",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "••••••••••",
        },
      },
      async authorize(credentials) {
        // TODO add credentials auth
        throw new Error("Credentials auth is disabled");
      },
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      if (!user.timeZone) {
        const timeZone = req.headers["x-vercel-ip-timezone"] as string;
        user.timeZone = timeZone || process.env.TZ;
        if (!user.timeZone || !isValidTimeZone(user.timeZone)) {
          user.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        }
      }
      return true;
    },
    async jwt({ token, trigger, user }) {
      switch (trigger) {
        case "signIn":
        case "signUp": {
          break;
        }
        case "update": {
          const userData = await prisma.user.findFirst({
            where: { email: token.email },
            select: {
              id: true,
              email: true,
              name: true,
              plan: true,
              timeZone: true,
              clockType: true,
            },
          });
          if (!userData) break;
          token.email = userData.email;
          token.name = userData.name;
          token.plan = userData.plan;
          token.timeZone = userData.timeZone;
          token.clockType = userData.clockType as 12 | 24;
          break;
        }
      }

      return {
        ...token,
        ...user,
        id: token.sub || user.id,
        image: token.picture || user.image,
      };
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          plan: token.plan,
          clockType: token.clockType,
          timeZone: token.timeZone,
        },
      };
    },
  },
  pages: {
    signIn: routes.LOGIN,
  },
  secret: process.env.NEXTAUTH_SECRET,
});

const Auth = (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, getAuthOptions(req));
};

export default Auth;

function isValidTimeZone(tz: string) {
  if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
    throw new Error("Time zones are not available in this environment");
  }
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}
