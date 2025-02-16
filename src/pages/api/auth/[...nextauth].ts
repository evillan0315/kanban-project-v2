import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

export const providersMap = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  }),
  GithubProvider({
    clientId: process.env.GITHUB_CLIENT_ID as string,
    clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  }),
  CredentialsProvider({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        throw new Error("Invalid credentials");
      }
      const hashedPassword = await bcrypt.hash(credentials?.password, 12);
      const user = await prisma.user.findUnique({
        where: {
          email: credentials.email,
        },
      });

      if (!user) {
        throw new Error("Invalid credentials");
      }
      const isCorrectPassword = await bcrypt.compare(
        credentials.password,
        hashedPassword
      );
      if (!isCorrectPassword) {
        throw new Error("Invalid credentials");
      }
      return user;
    },
  }),
];

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: providersMap,
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/auth/sign-in",
  },
};
export default NextAuth({
  ...authOptions,
  callbacks: {
    async signIn(user) {
      console.log(user, 'signin NextAuth');
      return true;
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    },
    async session({ session }) {
      if (session.user?.email) {
        const userD = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: {
            id: true,
            name: true,
            email: true,// Example: Fetching user role
            image: true,
          },
        });
        
        
        if (userD) {
          
          if(userD.email === 'evillan0315@gmail.com'){

            session.user = {
              ...session.user,
              id: userD.id,
              role: "Administrator" // Merge user data from database into session
            };
          } 
          session.user = {
            ...session.user,
            id: userD.id,
            role: "Authenticated", // Merge user data from database into session
          };
        }
      }

      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
      }
      return token;
    },
  },
});
