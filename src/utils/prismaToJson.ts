import * as fs from "fs";
import path from "path";

/**
 * Converts a Prisma model definition to an array of field objects.
 *
 * @param model The name of the Prisma model.
 * @returns An array of field objects with name, type, required/optional, and attributes.
 */
export function prismaToJson(model: string) {
  const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma");
  const existingSchema = fs.readFileSync(schemaPath, "utf-8");

  const modelRegex = new RegExp(`model\\s+${model}\\s+{([\\s\\S]*?)}`, "i");
  const match = existingSchema.match(modelRegex);

  if (!match) return null;

  const modelDefinition = match[1].trim();
  const fieldRegex = /^\s*(\w+)\s+([\w\[\]!]+)(.*?)$/gm;
  const fields = [];

  let fieldMatch;
  while ((fieldMatch = fieldRegex.exec(modelDefinition)) !== null) {
    const [, name, typeRaw, attributesRaw] = fieldMatch;
    
    const isOptional = typeRaw.endsWith("?");
    const type = typeRaw.replace("?", "");
    
    const attributes = [];
    const attrRegex = /@(\w+)(\((.*?)\))?/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(attributesRaw)) !== null) {
      const [, attrName, , attrArgs] = attrMatch;
      attributes.push({ name: attrName, args: attrArgs ? attrArgs.split(",").map(arg => arg.trim()) : [] });
    }

    fields.push({ name, type, required: !isOptional, attributes });
  }

  return fields;
}
