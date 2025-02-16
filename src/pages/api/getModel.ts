import type { NextApiRequest, NextApiResponse } from "next";

import * as fs from "fs";
import path from "path";
import runAs from "@/utils/runAs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sendMessage = (msg: string) => {
    res.write(`data: ${JSON.stringify({ message: msg })}\n\n`);
  };

  try {
    const { model } = req.query;

    sendMessage("📌 Running `prisma generate`...");
	await runAs("npx prisma generate", sendMessage);
	sendMessage("✅ Prisma generate completed!");

	sendMessage("📌 Running `prisma db pull`...");
	await runAs("npx prisma db pull", sendMessage);
	sendMessage("✅ Prisma DB Pull completed!");

	const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma");
	const existingSchema = fs.readFileSync(schemaPath, "utf-8");

	const modelRegex = new RegExp(`model\\s+${model}\\s+{([\\s\\S]*?)}`, "i");
	const match = existingSchema.match(modelRegex);

	if (match) {
	  sendMessage(`✅ Model "${model}" found!`);

	  const modelDefinition = match[1].trim();
	  const fieldRegex = /^\s*(\w+)\s+([\w\[\]!]+)(?:\s+@(\w+)\((.*?)\))?/gm;
	  const fields = [];

	  let fieldMatch;
	  while ((fieldMatch = fieldRegex.exec(modelDefinition)) !== null) {
	    const [, name, type, attribute, attributeArgs] = fieldMatch;
	    fields.push({
	      name,
	      type,
	      attribute: attribute || null,
	      attributeArgs: attributeArgs ? attributeArgs.split(",").map(arg => arg.trim()) : null,
	    });
	  }

	  return res.json({
	    model,
	    fields,
	  });
	} else {
	  sendMessage(`❌ Model "${model}" not found!`);
	  return res.status(404).json({ error: "Model not found" });
	}
  } catch (error) {
    sendMessage(`❌ Error: ${error}`);
    return res.end();
  }
}
