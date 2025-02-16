import type { NextApiRequest, NextApiResponse } from "next";

import * as fs from "fs";

import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).end(); // Method Not Allowed
  }

  try {
    const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma");
    const existingSchema = fs.readFileSync(schemaPath, "utf-8");

    // Extract model names
    const modelRegex = /model\s+(\w+)\s+{/g;
    const models: string[] = [];
    let match;
    while ((match = modelRegex.exec(existingSchema)) !== null) {
      models.push(match[1]);
    }

    return res.status(200).json({ models });
  } catch (error) {
    console.error("Error in API route:", error);
    return res.status(500).json({ error: error });
  }
}
