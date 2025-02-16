/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import * as React from "react";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";

import {
  AuthResponse,
  SignInPage,
  type AuthProvider,
} from "@toolpad/core/SignInPage";
import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { useRouter } from "next/router";
import { authOptions } from "../api/auth/[...nextauth]";

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  return (
    <SignInPage
      providers={providers}
      signIn={async (
        provider: AuthProvider,
        formData:any,
        callbackUrl?: string
      ) => {
        try {
          const signInResponse = await signIn(
            provider.id,
            formData
              ? {
                  email: formData.get("email") as string,
                  password: formData.get("password") as string,
                  redirect: false,
                }
              : { callbackUrl: callbackUrl ?? "/" }
          );

          if (signInResponse && signInResponse.error) {
            return {
              error:
                signInResponse.error === "CredentialsSignin"
                  ? "Invalid credentials"
                  : "An error with Auth.js occurred",
              type: signInResponse.error,
            } as AuthResponse; // Ensure this matches AuthResponse
          }

          // If the sign in was successful,
          // manually redirect to the callback URL
          if (provider.id === "credentials") {
            router.push(callbackUrl ?? "/");
          }
          return {}; // This should adhere to AuthResponse
        } catch (error) {
          return {
            error: String(error), // Explicitly cast the error to a string
            type: "UnknownError",
          } as AuthResponse;
        }
      }}

      //slots={{ forgotPasswordLink: ForgotPasswordLink, signUpLink: SignUpLink }}
    />
  );
}

SignIn.getLayout = (page: React.ReactNode) => page;
SignIn.requireAuth = false;


export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  console.log(session);
  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();
  let providerMap: AuthProvider[] = [];
  if (providers) {
    providerMap = Object.entries(providers).map(([id, provider]) => {
      return { id, name: provider.name };
    });
  }

  return {
    props: {
      providers: providerMap,
    },
  };
}

