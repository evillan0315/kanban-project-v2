/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from "next";
import prisma, { handler } from "@/lib/prisma"; // Import the centralized handler
import { PrismaModelKeys } from "@/types/dynamic";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import {prismaToJson} from "@/utils/prismaToJson"


export default async function dynamicApiRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const operation = req.method;
  const { model, type } = req.query;
  const session = await getServerSession(req, res, authOptions); // Get session for the request
  
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" }); // If no session, respond with Unauthorized
  }
  if(type==='fields'){
  	const fieldsArray = await prismaToJson(model as string);
      if(!fieldsArray){
        return res.status(401).json({ error: "No fields available" });
      }
      // Extract "Id" fields
      const idFields = fieldsArray
        .filter((field: { name: string }) => field.name.endsWith("Id"))
        .map((field) => field.name.replace(/Id$/, "")); // Remove "Id" suffix

      // Fetch related data dynamically
      const relatedData: Record<string, any[]> = {};
      await Promise.all(
        idFields.map(async (relatedModel) => {
          if (Object.keys(prisma).includes(relatedModel)) {
            const d = {
              select: { id: true, name: true }, // Fetch id & name
            }
            relatedData[relatedModel]  = await handler(relatedModel as PrismaModelKeys, "findManyFields", d);
          }
        })
      );

      return res.status(200).json({ fields: fieldsArray, options: relatedData });
  }
  
  // Extract the model name from the URL
  // Map HTTP methods to operations
  const data = req.method === "GET" ? req.query : req.body; // Use query for GET and body for other methods

  if (
    typeof model !== "string" ||
    !Object.keys(prisma).includes(String(model))
  ) {
    return res.status(400).json({ error: "Invalid model name." });
  }

  try {
    // Map HTTP methods to Prisma operations
    let operationName:
      | "findMany"
      | "findManyFields"
      | "findFilterMany"
      | "create"
      | "createWithRelation"
      | "update"
      | "delete"
      | "deleteMany"
      | "findUnique";
    switch (operation) {
      case "GET":
        if (req.query.pageId) {
          operationName = "findFilterMany";
        } else {
          operationName = req.query.id ? "findUnique" : "findMany";
        }
        break;
      case "POST":
        if (data.id || data.id === "" || data.id === null) {
          delete data.id;
        }
        if(data.include){
          operationName = "createWithRelation";
        } else {
          operationName = "create";
        }
        
        break;
      case "PUT":
        operationName = "update";
        break;
      case "DELETE":
        console.log(data, 'delete')
        if (data.ids) {
          operationName = "deleteMany";
        } else {
          operationName = "delete";
        }
        
        break;

      default:
        return res.status(405).json({ error: "Method not allowed." });
    }

    // Call the centralized handler
    const result = await handler(model as PrismaModelKeys, operationName, data);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in dynamic API route:", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
}
