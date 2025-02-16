import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    email: string;
    role?: string;
  }
  interface Session extends DefaultSession {
    user: User & DefaultSession["user"];
  }
}
