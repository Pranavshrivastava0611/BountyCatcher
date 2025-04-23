import { privy } from "@/lib/privyClient"
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  VersionedTransaction,
  TransactionMessage
} from '@solana/web3.js';
import { TRANSACTIONS, PULL_REQUEST } from "@/lib/schema";
import { db } from "@/configs/db";
import { eq } from "drizzle-orm";


export async function POST(request: Request) {
  const {
    repo, prNumber, mergedBy, maintainerPrivyId, contributorPrivyId,
    prUrl, contributorGithubId, contributorUsername,
    repoOwnerUsername, repoOwnerGithubId, amount
  } = await request.json();

  if (!repo || !prNumber || !mergedBy || !maintainerPrivyId || !contributorPrivyId ||
      !prUrl || !contributorGithubId || !contributorUsername || !repoOwnerUsername ||
      !repoOwnerGithubId || amount === undefined || amount === null) {
    return new Response('Missing required fields', { status: 400 });
  }

  const pr = await db.select().from(PULL_REQUEST).where(eq(PULL_REQUEST.prNumber, prNumber.toString())).limit(1);
  if (!pr || pr.length === 0) return new Response('Pull request not found', { status: 404 });
  const prId = pr[0].id;

  const maintainer = await privy.getUserById(maintainerPrivyId);
  const contributor = await privy.getUserById(contributorPrivyId);
  if (!maintainer || !contributor) return new Response('Invalid user', { status: 400 });

  const maintainerWallet = maintainer.linkedAccounts.find(
    acc => acc.type === 'wallet' && acc.walletClientType === 'privy' && acc.chainType === 'solana'
  );
  const contributorWallet = contributor.linkedAccounts.find(
    acc => acc.type === 'wallet' && acc.walletClientType === 'privy' && acc.chainType === 'solana'
  );
  if (!maintainerWallet || !contributorWallet) {
    return new Response('Wallet not found for either maintainer or contributor', { status: 400 });
  }

  const connection = new Connection(clusterApiUrl('devnet'));
  //@ts-ignore
  const walletPublicKey = new PublicKey(maintainerWallet.address);
  // @ts-ignore
  const contributorPublicKey = new PublicKey(contributorWallet.address);

  // ✅ Check balance first
  const maintainerBalance = await connection.getBalance(walletPublicKey);
  const amountInLamports = amount * LAMPORTS_PER_SOL;

  if (maintainerBalance < amountInLamports) {
    // 📨 Send Email using EmailJS

    return new Response("Insufficient balance. Email sent to maintainer.", { status: 402 });
  }

  // ✅ Proceed with transaction
  const instruction = SystemProgram.transfer({
    fromPubkey: walletPublicKey,
    toPubkey: contributorPublicKey,
    lamports: amountInLamports
  });

  const { blockhash: recentBlockhash } = await connection.getLatestBlockhash();
  const message = new TransactionMessage({
    payerKey: walletPublicKey,
    instructions: [instruction],
    recentBlockhash
  });

  const transaction = new VersionedTransaction(message.compileToV0Message());

  const { hash } = await privy.walletApi.solana.signAndSendTransaction({
    //@ts-ignore
    walletId: maintainerWallet.id,
    caip2: 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1',
    transaction,
  });

  // const { signedTransaction } = await privy.walletApi.solana.signTransaction({
  //   //@ts-ignore
  //   walletId: maintainerWallet.id,
  //   transaction
  // });

  await db.insert(TRANSACTIONS).values({
    prId,
    amount: amount.toString(),
    contributor: contributorUsername,
    maintainer: repoOwnerUsername,
    tokenType: "SOL",
    txHash: hash,
    status: "success",
    createdAt: new Date(),
  });
  return new Response(hash, { status: 200 });
}
