import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    /// uncomment if you wnt to download the file
    //This will prompt the user to download the file. Remember to keep the Content-Type header consistent with the file type (e.g., text/plain or application/typescript).
    
    //res.setHeader('Content-Disposition', 'attachment; filename="mycode.ts"');
    try {
      // 1. Retrieve the TypeScript code from your database
      const typescriptCode = await getTypescriptCodeFromDatabase(req.query.id as string); // Replace with your database logic

      if (!typescriptCode) {
        return res.status(404).end('Not Found');
      }

      // 2. Set the appropriate Content-Type header
      res.setHeader('Content-Type', 'text/plain'); // Or 'application/typescript' if you prefer

      // 3. Send the TypeScript code as the response
      res.status(200).send(typescriptCode);

    } catch (error) {
      console.error("Error retrieving code:", error);
      res.status(500).json({ error: 'Failed to retrieve code' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed for other requests
  }
}

// Placeholder function - replace with your actual database retrieval logic
async function getTypescriptCodeFromDatabase(id: string): Promise<string | null> {
  // Example using a hypothetical database connection:
  // const code = await db.query('SELECT code FROM typescript_codes WHERE id = ?', [id]);
  // return code[0]?.code || null;

  // For demonstration, let's just return some sample code:
  if (id === '1') {
    return `
      // This is some sample TypeScript code
      function greet(name: string): string {
        return "Hello, " + name;
      }

      console.log(greet("World"));
    `;
  }
  return null;
}