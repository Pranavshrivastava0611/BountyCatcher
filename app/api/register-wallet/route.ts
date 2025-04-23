import { db } from '@/configs/db';
import { USER_TABLE } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId,githubId, username, email, privyWallet } = body;
    console.log("userId : ",userId);

    if (!githubId || !username || !privyWallet) {
      return new Response(
        JSON.stringify({ message: 'Missing required fields' }),
        { status: 400 }
      );
    }
    const existing = await db
      .select()
      .from(USER_TABLE)
      .where(eq(USER_TABLE.githubId, githubId));

    if (existing.length > 0) {
      await db
        .update(USER_TABLE)
        .set({ privyWallet })
        .where(eq(USER_TABLE.githubId, githubId));
    } else {
      await db.insert(USER_TABLE).values({
        userId,
        githubId,
        username,
        email,
        privyWallet,
        role: 'maintainer',
      });
    }

    return new Response(JSON.stringify({ message: 'Wallet registered' }), {
      status: 200,
    });
  } catch (err) {
    console.error('Failed to register wallet:', err);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500 }
    );
  }
}
