import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";


const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { name } = req.query;
    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Invalid file name" });
    }
    
    const file = await prisma.file.findUnique({
      where: { name },
    });

   
    if (!file) {

      
        
    }

    return res.status(200).json({ content: file?.content });
  } catch (error) {
    return res.status(500).json({ error: "Error reading file", details: error });
  }
}


