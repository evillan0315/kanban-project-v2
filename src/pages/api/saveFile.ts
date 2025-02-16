import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { name, content, type } = req.body;

    if (!name || !content) {
      return res.status(400).json({ error: "Missing file name or content" });
    }

    // Upsert: If file exists, update it; otherwise, create a new one
    const file = await prisma.file.upsert({
      where: { name },
      update: { content },
      create: { name, content, type },
    });

    return res.status(200).json({ success: true, file });
  } catch (error) {
    return res.status(500).json({ error: "Failed to save file", details: error });
  }
}
