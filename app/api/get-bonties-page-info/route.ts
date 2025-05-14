import { REPOS, USER_TABLE, BOUNTIES } from "@/lib/schema";
import { db } from "@/configs/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const user_info = await db.select().from(USER_TABLE);
    const bounties = await db.select().from(BOUNTIES).where(eq(BOUNTIES.status, "closed"));
    const repos = await db.select().from(REPOS);

    return NextResponse.json({
      user_info,
      bounties,
      repos,
    });
  } catch (error) {
    console.log("error in getting the bounties page info", error);
    return NextResponse.json({
      error: "error in getting the bounties page info",
    });
  }
}
