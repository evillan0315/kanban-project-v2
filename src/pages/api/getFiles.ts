import type { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "@/lib/prisma";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = getServerSession(req, res, authOptions);
    if(!session){
      throw Error("Not Authorized")
    }


    const files = await prisma.file.findMany();
    res.status(200).json(files);
  } catch (error) {
    console.error("Error in API route:", error);
    return res.status(500).json({ error: error });
  }
}
