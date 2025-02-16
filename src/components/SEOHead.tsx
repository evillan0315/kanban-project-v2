"use client";
import Head from "next/head";

const SEOHead = () => {
  const project = {
    id: 2,
    name: "Portfolio Website",
    startDate: "2024-10-01T00:00:00.000Z",
    endDate: "2024-12-01T00:00:00.000Z",
    description:
      "Designed a personal portfolio using ReactJS, NextJS, Material-UI, and TailwindCSS, featuring a custom theme to highlight work and skills. Simple dashboard for project management user interface., Ability to add and update project. Implemented Google and Github OAuth Login using NextAuth.",
    url: "https://eddie-porfolio.vercel.app",
    repo: "https://github.com/evillan0315/eddie-portfolio-v2",
    frontend: {
      technologies: ["ReactJS", "NextJS", "TailwindCSS", "MUI"],
    },
    backend: {
      technologies: [
        "Prisma",
        "NextAuth",
        "OAuth",
        "GoogleLogin",
        "GithubLogin",
      ],
    },
    database: {
      technologies: ["MongoDB", "PostgreSQL"],
    },
    api: {
      technologies: ["REST", "NodeMailer", "Prisma"],
    },
    deployment: {
      technologies: ["Vercel", "GitHubActions"],
    },
  };

  const keywords = [
    project.name,
    ...project.frontend.technologies,
    ...project.backend.technologies,
    ...project.database.technologies,
    ...project.api.technologies,
    ...project.deployment.technologies,
  ].join(", ");

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{project.name}</title>
      <meta name="description" content={project.description} />
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <meta charSet="UTF-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Eddie Villanueva" />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={project.name} />
      <meta property="og:description" content={project.description} />
      <meta property="og:url" content={project.url} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={`${project.url}/og-image.jpg`} />
      <meta property="og:site_name" content="Eddie's Portfolio" />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={project.name} />
      <meta name="twitter:description" content={project.description} />
      <meta name="twitter:image" content={`${project.url}/twitter-image.jpg`} />
      <meta name="twitter:creator" content="@yourtwitterhandle" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default SEOHead;
