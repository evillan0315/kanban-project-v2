import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";
import NextLink from "next/link";

const PageToolbar = ({ title }: { title: string }) => {
  const router = useRouter();

  return (
    <AppBar position="relative">
      <Toolbar>
        <NextLink href="/" passHref>
          <Button color="inherit" sx={{ marginRight: 2 }}>
            Home
          </Button>
        </NextLink>

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>

        {/* Optional actions */}
        <Button color="inherit" onClick={() => router.push("/settings")}>
          Settings
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default PageToolbar;
