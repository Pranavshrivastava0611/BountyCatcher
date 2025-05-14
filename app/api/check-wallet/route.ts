import { db } from "@/configs/db";
import { USER_TABLE } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new Response(
        JSON.stringify({ message: "User ID is required" }),
        { status: 400 }
      );
    }

    const user = await db
      .select()
      .from(USER_TABLE)
      .where(eq(USER_TABLE.username, userId));

    return new Response(
      JSON.stringify({ registered: user.length > 0 }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving user:", error);
    return new Response(
      JSON.stringify({ message: "Error retrieving user" }),
      { status: 500 }
    );
  }
}
