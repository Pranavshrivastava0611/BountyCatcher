import { db } from "@/configs/db";
import { BOUNTIES } from "@/lib/schema";
import { eq ,and} from "drizzle-orm";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    try {
       
        const completedBounties = await db.select().from(BOUNTIES).where(and(eq(BOUNTIES.contributorId, userId), eq(BOUNTIES.status, "closed")));

      
        const generatedBounties = await db.select().from(BOUNTIES).where(eq(BOUNTIES.repoOwner, userId));

        return NextResponse.json({ completedBounties, generatedBounties }, { status: 200 });
    } catch (error) {
        console.error("Error fetching bounties:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
