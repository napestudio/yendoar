import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions, User } from "next-auth";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import db from "@/lib/prisma";

import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "E-mail" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any, req) {
        // Add logic here to look up the user from the credentials supplied
        const user: any = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          return null;
        }
        // Any object returned will be saved in `user` property of the JWT
        const { password, validatedPassword, ...props } = user;
        const valid = await bcrypt.compare(credentials.password, password);

        if (!valid) {
          return null;
        }

        return props;
      },
    }),
  ],

  pages: {
    signIn: "/ingresar",
    signOut: "/",
    error: "/ingresar", //TODO
    //verifyRequest: "/auth/verify-request", // (used for check email message)
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }: { user: User; account: any }) {
      try {
        const { name, email } = user;
        const createdUser: any = await db.user.findUnique({
          where: {
            email,
          },
        });

        if (!createdUser) {
          const invitedUser: any = await db.invitation.findFirst({
            where: {
              email,
            },
          });

          if (invitedUser) {
            if (account.provider !== "google") {
              const { password, validatedPassword, ...props } = createdUser;
              return props;
            }
            return true;
          }

          return null;
        }

        if (account.provider !== "google") {
          const { password, validatedPassword, ...props } = createdUser;
          return props;
        }

        return true;
      } catch (error) {
        throw new Error("Error sign in");
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user?.id;
        token.role = user?.type;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.type = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
      await db.userConfiguration.create({
        data: {
          userId: user.id,
        },
      });
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
