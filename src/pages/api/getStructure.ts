import type { NextApiRequest, NextApiResponse } from "next";

import * as path from "path";
import { getDirectoryStructure } from "@/utils/generateStructure";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const rootDir = process.cwd();
    const fullPath = path.join(rootDir, "/");
    console.log(fullPath);
    const currentPath = await getDirectoryStructure(fullPath, [
      "node_modules",
      ".next",
    ]);
    //const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma");
    // const existingSchema = fs.readFileSync(schemaPath, "utf-8");

    // Extract model name
    console.log(currentPath);
    res.status(200).json(currentPath);
  } catch (error) {
    console.error("Error in API route:", error);
    return res.status(500).json({ error: error });
  }
}
