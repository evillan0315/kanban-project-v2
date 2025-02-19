import React from "react";
import { useRouter } from "next/router";
import { Breadcrumbs, Link } from "@mui/material";
import NextLink from "next/link";

const DynamicBreadcrumbs = ({ title }: { title: string }) => {
  const router = useRouter();
  const { model, id } = router.query; // Use this for dynamic route params

  // Define breadcrumb items (you can add more static breadcrumbs if needed)
  const breadcrumbs = [
    { label: "Home", href: "/" },
  ];

  // If the page is a task detail page, add dynamic breadcrumb for the task
  if (id) {
    breadcrumbs.push({ label: `${model}`, href: `/${model}/${id}` });
  }

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {breadcrumbs.map((breadcrumb, index) => (
        <NextLink key={index} href={breadcrumb.href} passHref>
          <Link underline="hover" color="inherit">
            {breadcrumb.label}
          </Link>
        </NextLink>
      ))}
    </Breadcrumbs>
  );
};

export default DynamicBreadcrumbs;
