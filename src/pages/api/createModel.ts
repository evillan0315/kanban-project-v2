import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import path from "path";
import runAs from "@/utils/runAs";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    // 🚀 Changed to GET for SSE compatibility
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*"); // Optional for CORS

  const sendMessage = (msg: string) => {
    res.write(`data: ${JSON.stringify({ message: msg })}\n\n`);
  };

  try {
    const { modelName, schema } = req.query;
    if (!modelName || !schema) {
      sendMessage("❌ Missing required parameters.");
      return res.end();
    }

    const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma");

    sendMessage("🚀 Creating schema...");

    const existingSchema = fs.readFileSync(schemaPath, "utf-8");

    const modelRegex = new RegExp(`model\\s+${modelName}\\s+{`, "i");
    if (modelRegex.test(existingSchema)) {
      sendMessage(`❌ Model "${modelName}" already exists.`);
      return res.end();
    }

    const updatedSchema = `${existingSchema}\n\n${schema}`;
    fs.writeFileSync(schemaPath, updatedSchema);
    sendMessage("✅ Schema updated!");

    sendMessage("📌 Running Prisma commands...");
    await runAs("npx prisma format", sendMessage);
    await runAs("npx prisma generate", sendMessage);
    await runAs("npx prisma db push --accept-data-loss", sendMessage);

    sendMessage(`🎉 Model "${modelName}" created successfully!`);

    // ✅ Close Prisma connection
    await prisma.$disconnect();

    return res.end();
  } catch (error) {
    sendMessage(`❌ Error: ${error}`);

    // ✅ Ensure Prisma disconnects even if there's an error
    await prisma.$disconnect();

    return res.end();
  }
}
