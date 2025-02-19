/* eslint-disable @typescript-eslint/no-explicit-any */
import "@/styles/globals.scss";
import * as React from "react";
import SEOHead from "@/components/SEOHead";
import { NextAppProvider } from "@toolpad/core/nextjs";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import Head from "next/head";
import { useRouter } from "next/router";
import { AppCacheProvider } from "@mui/material-nextjs/v15-pagesRouter";

import { PageContainer } from "@toolpad/core/PageContainer";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { Navigation } from "@toolpad/core/AppProvider";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
//import LinearProgress from '@mui/material/LinearProgress';
import { LoadingProvider } from "@/hooks/useLoading";
import GlobalLoader from "@/components/GlobalLoader";

import Logo from "@/components/Logo";
import { LabelImportant } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import theme from "@/theme";
import IconComponent from "@/components/icons/IconComponent";
import BasicSpeedDial from "@/components/icons/SpeedDial";
import ErrorBoundary from "@/components/ErrorBoundary";
import { SnackbarProvider } from "notistack";
import CssBaseline from "@mui/material/CssBaseline";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement<any>) => React.ReactNode;
  requireAuth?: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    title: "Dashboard",
    icon: <IconComponent iconName="dashboard" size={26} />,
  },
  {
    segment: "user",
    title: "Users",
    icon: <IconComponent iconName="user" size={26} />,
  },
  {
    segment: "organization",
    title: "Organizations",
    icon: <IconComponent iconName="organization" size={26} />,
  },
  {
    segment: "role",
    title: "Roles",
    icon: <IconComponent iconName="lock" size={26} />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Component Management"
  },
  {
    segment: "component",
    title: "Components",
    icon: <IconComponent iconName="component" size={26} />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Project Management"
  },
  {
    segment: "project",
    title: "Project",
    icon: <IconComponent iconName="project" size={26} />,
  },
  {
    segment: "board",
    title: "Board",
    icon: <IconComponent iconName="board" size={26} />,
  },
  {
    segment: "task",
    title: "Tasks",
    icon: <IconComponent iconName="task" size={26} />,
  },
  {
    segment: "priority",
    title: "Priority",
    icon: <IconComponent iconName="priority" size={26} />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Content Management",
  },
  {
    segment: "post",
    title: "Post",
    icon: <IconComponent iconName="item" size={26} />,
  },

  {
    segment: "page",
    title: "Page",
    icon: <IconComponent iconName="status" size={26} />,
  },
  {
    segment: "documentation",
    title: "Documentation",
    icon: <IconComponent iconName="book" size={26} />,
  },
  {
    segment: "schema-editor",
    title: "Schema",
    icon: <IconComponent iconName="database" size={26} />,
  },
  {
    segment: "swingers",
    title: "Swingers",
    icon: <LabelImportant />,
  },
];

const BRANDING = {
  title: "Project Management",
  home_url: "/dashboard",
  logo: <Logo width={30} height={30} />,
};

const AUTHENTICATION = {
  signIn,
  signOut,
};

function getDefaultLayout(page: React.ReactElement<any>) {
  return (
    <DashboardLayout defaultSidebarCollapsed>
      <PageContainer maxWidth={false} sx={{}}>
        {page}
      </PageContainer>
    </DashboardLayout>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { status } = useSession();

  //const {loading} = useLoading()
  const router = useRouter();

  if (status === "loading") {
    //return <LinearProgress />;
    return <GlobalLoader />;
  }

  if (status === "unauthenticated") {
    router.push("/auth/sign-in");
  }

  return children;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  return (
    <React.Fragment>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <SEOHead />
      <NextAppProvider
        navigation={NAVIGATION}
        branding={BRANDING}
        session={session}
        authentication={AUTHENTICATION}
        theme={theme}
      >
        {children}
      </NextAppProvider>
    </React.Fragment>
  );
}

export default function App(props: AppPropsWithLayout) {
  const {
    Component,
    pageProps: { session, ...pageProps },
  } = props;

  const getLayout = Component.getLayout ?? getDefaultLayout;
  const requireAuth = Component.requireAuth ?? true;

  let pageContent = getLayout(<Component {...pageProps} />);
  if (requireAuth) {
    pageContent = <RequireAuth>{pageContent}</RequireAuth>;
  }
  pageContent = <AppLayout>{pageContent}</AppLayout>;

  return (
    <AppCacheProvider {...props}>
      <SessionProvider session={session}>
      <CssBaseline /> {/* Inject MUI CSS resets */}
        <LoadingProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ErrorBoundary>
           <div className="relative">
            <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
            {pageContent}
            </SnackbarProvider>
         <BasicSpeedDial />
            </div>
            </ErrorBoundary>
          </LocalizationProvider>
        </LoadingProvider>
      </SessionProvider>
    </AppCacheProvider>
  );
}
