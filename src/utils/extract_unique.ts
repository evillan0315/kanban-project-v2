/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

interface JsonData {
    USERID: number;
    EMAIL: string;
    NAME: string;
    [key: string]: any;
}

interface Member {
    json_data: JsonData;
}

interface Item {
    member?: Member;
}

export async function fetchDataFromAPI(apiUrl: string): Promise<void> {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const jsonData: Item[] = await response.json();
        
        if (!Array.isArray(jsonData)) {
            throw new Error("Invalid data format: Expected an array");
        }
        
        const uniqueJsonData: JsonData[] = [];
        const userIds = new Set<number>();
        
        jsonData.forEach((item: Item) => {
            if (item.member?.json_data) {
                const jsonData = item.member.json_data;
                
                if (!userIds.has(jsonData.USERID)) {
                    userIds.add(jsonData.USERID);
                    uniqueJsonData.push(jsonData);
                }
            }
        });
        
        await saveToDatabase(uniqueJsonData);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function saveToDatabase(data: JsonData[]): Promise<void> {
    try {
        for (const jsonData of data) {
            await prisma.swingers.upsert({
                where: { swingerID: String(jsonData.USERID) },
                update: { jsonData: jsonData },
                create: {
                    email: jsonData.EMAIL || "",
                    name: jsonData.NAME || "",
                    swingerID: String(jsonData.USERID),
                    jsonData: jsonData,
                },
            });
        }
        console.log("Data successfully saved to the database");
    } catch (error) {
        console.error("Error saving data to the database:", error);
    } finally {
        await prisma.$disconnect();
    }
}



