import { db } from "@/configs/db";
import { BOUNTIES } from "@/lib/schema";

export async function GET(request: Request) {
    try{
        const bounties = await db.select().from(BOUNTIES);
        console.log("bounties",bounties);
        return new Response(JSON.stringify(bounties), { status: 200 });
    }catch(error){
        console.error("Error fetching bounties:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}