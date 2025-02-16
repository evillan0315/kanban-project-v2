import { fetchDataFromAPI } from "@/utils/extract_unique";
import type { NextApiRequest, NextApiResponse } from "next";



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await fetchDataFromAPI("https://chatv.swinglifestyle.com/subscribers?_sort=updated_at:DESC&_limit=500&token=dTK6LOd93Mpdv1DP3sk4xfEQm7IGtYLD2");

    //if (!response) throw new Error("Failed to fetch data");
    res.status(200).json({ message: "Data fetched successfully" });

  } catch (error) {
    console.log(error)
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
