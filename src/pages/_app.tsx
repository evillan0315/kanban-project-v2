/* eslint-disable @typescript-eslint/no-explicit-any */
import "@/styles/globals.css";
import * as React from "react";
import SEOHead from "@/components/SEOHead";
import { NextAppProvider } from "@toolpad/core/nextjs";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import Head from "next/head";
import { useRouter } from "next/router";
import { AppCacheProvider } from "@mui/material-nextjs/v15-pagesRouter";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { PageContainer } from '@toolpad/core/PageContainer';
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { Navigation } from "@toolpad/core/AppProvider";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
//import LinearProgress from '@mui/material/LinearProgress';
import { LoadingProvider, useLoading } from "@/hooks/useLoading";
import GlobalLoader from "@/components/GlobalLoader";

import Logo from "@/components/Logo";
import { BookmarkAddRounded, Business, ColorLens, LabelImportant, LockPerson, People, StarOutlineSharp, TaskAltOutlined, ViewKanban } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import theme from "@/theme";


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
    icon: <DashboardIcon />,
  },
  {
    segment: "user",
    title: "Users",
    icon: <People />,
  },
  {
    segment: "organization",
    title: "Organizations",
    icon: <Business />,
  },
  {
    segment: "role",
    title: "Roles",
    icon: <LockPerson />,
  },
  {
    kind: "divider",
 
  },

  {
    kind: "header",
    title: "Project Management",
  },
  {
    segment: 'project',
    title: 'Projects',
    icon: <ViewKanban />,
    children: [
      {
        segment: 'board',
        title: 'Board',
        icon: <BookmarkAddRounded />,
      },

    ],
  },
  {
    segment: "color",
    title: "Color",
    icon: <ColorLens />,
  },
  {
    segment: 'item',
    title: 'Items',
    icon: <TaskAltOutlined />,
  },
  {
    segment: 'task',
    title: 'Tasks',
    icon: <TaskAltOutlined />,
  },
  {
    segment: "status",
    title: "Status",
    icon: <StarOutlineSharp />,
  },
  {
    segment: "priority",
    title: "Priority",
    icon: <LabelImportant />,
  },
  {
    segment: "swingers",
    title: "Swingers",
    icon: <LabelImportant />,
  },

];

const BRANDING = {
  title: "Project Management",
  home_url: "/",
  logo: <Logo width={30} height={30} />,
};

const AUTHENTICATION = {
  signIn,
  signOut,
};

function getDefaultLayout(page: React.ReactElement<any>) {
  return <DashboardLayout defaultSidebarCollapsed><PageContainer maxWidth={false} sx={{}}>{page}</PageContainer></DashboardLayout>;
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const { setLoading } = useLoading();
  //const {loading} = useLoading()
  const router = useRouter();

  if (status === "loading") {
    setLoading(true);
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <LoadingProvider>{pageContent}</LoadingProvider>
        </LocalizationProvider>
      </SessionProvider>
    </AppCacheProvider>
  );
}
