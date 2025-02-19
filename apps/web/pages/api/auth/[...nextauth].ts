import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@poll/prisma";
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
        console.log(credentials);
        throw new Error("Credentials auth is disabled");
      },
    }),
  ],

  callbacks: {
    async jwt({ token, trigger }) {
      const user = await prisma.user.findFirst({
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

      if (trigger === "update") {
        token.name = user.name;
        token.email = user.email;
        token.clockType = user.clockType;
      }

      if (!user) return token;
      if (!user.timeZone) {
        const timeZone = req.headers["x-vercel-ip-timezone"] as string;
        if (isValidTimeZone(timeZone)) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              timeZone: timeZone,
            },
          });
        }
      }
      return {
        ...token,
        ...user,
      };
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          id: token.id,
          ...session.user,
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
