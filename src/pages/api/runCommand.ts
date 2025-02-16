import type { NextApiRequest, NextApiResponse } from "next";

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
    const { command } = req.query;

    //sendMessage("📌 Sending command...");
    await runAs(String(command), sendMessage);
    return res.end();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    sendMessage(`❌ Error: ${error.message}`);
    return res.end();
  }
}
