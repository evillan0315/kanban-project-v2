import type { NextApiRequest, NextApiResponse } from "next";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Store in .env.local

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch("https://api.github.com/repos/evillan0315/eddie-portfolio-v2/issues", {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch data");

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
