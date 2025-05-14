import { ApplicationFunction } from "probot";
import { db } from "@/configs/db";
import { BOUNTIES,USER_TABLE,PULL_REQUEST,REPOS} from "@/lib/schema";
import { eq ,and} from "drizzle-orm";
import axios from "axios";
import { Connection,clusterApiUrl } from "@solana/web3.js";
import { CheckBalance } from "@/lib/getBalance";

const connection = new Connection(clusterApiUrl("devnet"));


const app: ApplicationFunction = (app) => {
  app.log.info("🤖 BountyCatcher bot loaded!");
  app.log.info("🤖 Loading app...");

  app.on("pull_request.opened", async (context) => {
    const pr = context.payload.pull_request;
    const repo = context.payload.repository;
    const githubId = pr.user.id.toString();
    const maintainerGithubId = context.payload.sender.id.toString();
    const prBody = pr.body?.trim();
    const [owner, repoName] = context.payload.repository.full_name.split("/");
  
    if (!prBody || prBody === "") {
      await context.octokit.issues.createComment({
        owner,
        repo: repoName,
        issue_number: pr.number,
        body: `🚨 @${pr.user.login}, your PR must include a description and the related issue using the format \`fix_issue#<issue_number>\`.`,
      });
  
      await context.octokit.pulls.update({
        owner,
        repo: repoName,
        pull_number: pr.number,
        state: "closed",
      });
      return;
    }
  
    const match = prBody.match(/fix_issue#(\d+)/);
    if (!match) {
      await context.octokit.issues.createComment({
        owner,
        repo: repoName,
        issue_number: pr.number,
        body: `🚨 @${pr.user.login}, your PR must include the issue it fixes using the format \`fix_issue#<issue_number>\` (e.g., \`fix_issue#23\`).\n\n👉 Please close this PR and open a new one with the correct format.`,
      });
  
      await context.octokit.pulls.update({
        owner,
        repo: repoName,
        pull_number: pr.number,
        state: "closed",
      });
      return;
    }
  
    const bountyIssueNumber = match[1];

    const existingUser = await db
      .select()
      .from(USER_TABLE)
      .where(eq(USER_TABLE.githubId, githubId));
    const user = existingUser[0];
  
    if (!user || !user.privyWallet) {
      await context.octokit.issues.createComment({
        owner,
        repo: repoName,
        issue_number: pr.number,
        body: `🚨 @${pr.user.login}, please [register and link your wallet](https://forkup.vercel.app/dashboard) to participate in bounties.`,
      });
      return;
    }

    const existingRepo = await db
      .select()
      .from(REPOS)
      .where(eq(REPOS.githubRepoId, repo.node_id));
    const repoEntry = existingRepo[0];
    if (!repoEntry) return;

    console.log("repoEntry : ", repoEntry);
  
    // ✅ Check bounty status
    console.log("bountyIssueNumber : ", bountyIssueNumber);
    console.log("repoEntry.id : ", repoEntry.id);
    const bountyRecord = await db
      .select()
      .from(BOUNTIES)
      .where(
        and(
          eq(BOUNTIES.issueNumber, bountyIssueNumber),
          eq(BOUNTIES.repoId, repoEntry.githubRepoId)
        )
      );
      console.log("bountyRecord : ", bountyRecord[0]);
    const bounty = bountyRecord[0];
  
    if (!bounty) {
      await context.octokit.issues.createComment({
        owner,
        repo: repoName,
        issue_number: pr.number,
        body: `🚫 No bounty found for issue \`#${bountyIssueNumber}\`. Please check the issue number.`,
      });
  
      await context.octokit.pulls.update({
        owner,
        repo: repoName,
        pull_number: pr.number,
        state: "closed",
      });
  
      return;
    }

    if (bounty.status !== "open") {
      await context.octokit.issues.createComment({
        owner,
        repo: repoName,
        issue_number: pr.number,
        body: `🚫 The bounty for issue \`#${bountyIssueNumber}\` is **closed** and is no longer accepting PRs.`,
      });
  
      await context.octokit.pulls.update({
        owner,
        repo: repoName,
        pull_number: pr.number,
        state: "closed",
      });
  
      return;
    }

    //check for the maintainer's wallet balance ;
    try{
      
      const maintainer = await db
      .select()
      .from(USER_TABLE)
      //@ts-ignore
      .where(eq(USER_TABLE.username,bounty.repoInfo.owner));

      if (!maintainer.length) {
        throw new Error("Maintainer not found in DB");
      }

      const maintainerPrivyId = maintainer[0].userId;
      const reponse = await CheckBalance(maintainerPrivyId);
      const balance = await reponse!.json();
      if(balance.balance < bounty.amount){
        await context.octokit.issues.createComment({
          owner,
          repo: repoName,
          issue_number: pr.number,
          body: `🚨 @${pr.user.login}, the maintainer does not have enough balance to pay the bounty for this PR. Please contact the maintainer.`,
        });
        await context.octokit.pulls.update({
          owner,
          repo: repoName,
          pull_number: pr.number,
          state: "closed",
        });
        return;
      }
    }catch(error){
      app.log.error(error);
    }

    // ✅ Everything passed
    await context.octokit.issues.createComment({
      owner,
      repo: repoName,
      issue_number: pr.number,
      body: `👋 Hello @${pr.user.login}, thanks for your PR! A maintainer will review it soon.\n✅ You correctly referenced an issue using \`fix_issue#${bountyIssueNumber}\`.`,
    });
  
    try {
      await db.insert(PULL_REQUEST).values({
        prNumber: pr.number.toString(),
        title: pr.title,
        description: pr.body || "",
        status: "open",
        contributorId: user.id,
        bountyId: bountyIssueNumber, // treated as string
        repoId: repoEntry.id,
        githubUrl: pr.html_url,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Error inserting into PULL_REQUEST:", error);
    }
  });
  
  // You can add more event handlers here.
  app.on("issue_comment.created", async (context) => {
    const comment = context.payload.comment.body.trim();
    const sender = context.payload.sender.login;
    const githubId = context.payload.sender.id.toString();
    const [owner, repo] = context.payload.repository.full_name.split("/");
    const issueNumber = context.payload.issue.number;
  
    if (!comment.startsWith("/registerBounty")) return;
  
    const parts = comment.split(" ");
    if (parts.length !== 3) {
      await context.octokit.issues.createComment(context.issue({
        body: `❗ Invalid usage. Format should be: \`/registerBounty 1SOL https://github.com/org/repo\``,
      }));
      return;
    }
    const amountWithToken = parts[1];
    const repoUrl = parts[2];
  
    const match = amountWithToken.match(/^(\d+(?:\.\d+)?)([A-Za-z]+)$/);
    if (!match) {
      await context.octokit.issues.createComment(context.issue({
        body: `❗ Invalid amount/token format. Example: \`1SOL\`, \`0.5USDC\``,
      }));
      return;
    }
  
    const amount = match[1];
    const tokenType = match[2].toUpperCase();
  
    // Check permission
    const { data: permissionData } = await context.octokit.repos.getCollaboratorPermissionLevel({
      owner,
      repo,
      username: sender,
    });
  
    const permission = permissionData.permission;
    if (permission !== "admin" && permission !== "write") {
      await context.octokit.issues.createComment(context.issue({
        body: `🚫 @${sender}, you don't have permission to register a bounty.`,
      }));
      return;
    }
    // ✅ Check if user has a privy wallet
    const existingUser = await db
      .select()
      .from(USER_TABLE)
      .where(eq(USER_TABLE.githubId, githubId));
  
    const user = existingUser[0];
  
    if (!user || !user.privyWallet) {
      await context.octokit.issues.createComment(context.issue({
        body: `🚫 @${sender}, you need to [register your wallet](https://forkup.vercel.app/dashboard) before creating a bounty.\n\n👉 Visit the link and connect your wallet via GitHub login.`,
      }));
      return;
    }
    // Optional: Check if bounty for this issue already exists
    console.log("repoId : ", context.payload.repository.node_id);
    console.log("issueNumber : ", issueNumber);
    const existing = await db
      .select()
      .from(BOUNTIES)
      .where(and(
        eq(BOUNTIES.repoId, context.payload.repository.node_id),
        eq(BOUNTIES.issueNumber, String(issueNumber))
      ));

      console.log("existing", existing);
  
    if (existing.length > 0) {
      await context.octokit.issues.createComment(context.issue({
        body: `ℹ️ A bounty is already registered for this issue.`,
      }));
      return;
    }
  
    // 🔽 Check if repo is already registered
    const githubRepoId = context.payload.repository.node_id;
    const fullRepoName = context.payload.repository.full_name;
  
    let repoEntry = await db
      .select()
      .from(REPOS)
      .where(eq(REPOS.githubRepoId, githubRepoId));
  
    if (repoEntry.length === 0) {
      // Register repo if not already present
      const insertedRepo = await db.insert(REPOS).values({
        githubRepoId,
        owner: context.payload.repository.owner.login,
        name: context.payload.repository.name,
        fullName: fullRepoName,
        installationId: String(context.payload.installation!.id),
        registeredById: user.id,
      }).returning();
  
      repoEntry = insertedRepo;
    }
    const issue = await context.octokit.issues.get({
      owner,
      repo,
      issue_number: Number(issueNumber),
    });
    // ✅ Register the bounty
    await db.insert(BOUNTIES).values({
      title: issue.data.title,
      description: issue.data.body || "No description provided.",
      amount,
      tokenType,
      repoId: context.payload.repository.node_id,
      repoOwner: context.payload.repository.owner.login,
      repoInfo: JSON.stringify({
        name: context.payload.repository.name,
        full_name: context.payload.repository.full_name,
        owner: context.payload.repository.owner.login,
        default_branch: context.payload.repository.default_branch,
      }),
      repoLink: `https://github.com/${context.payload.repository.owner.login}/${repo}/issues/${issueNumber}`,
      issueNumber: String(issueNumber),
      status: "open",
    });
  
    await context.octokit.issues.createComment(context.issue({
      body: `✅ Registered bounty of **${amount} ${tokenType}** for: [${repoUrl}#${issueNumber}](${repoUrl}/issues/${issueNumber}) by @${sender}`,
    }));
  });

  app.on('pull_request.closed', async (context) => {
    const pr = context.payload.pull_request;
    const isMerged = pr.merged;
  
    if (!isMerged) return;
  
    const prBody = pr.body?.trim() || "";
    const prNumber = pr.number;
    const [owner, repo] = context.payload.repository.full_name.split("/");
    const repoId = context.payload.repository.node_id;
  
    const contributorGithubId = pr.user.id.toString();
    const contributorUsername = pr.user.login;
    const mergerGithubId = context.payload.sender.id.toString();
    const mergerUsername = context.payload.sender.login;
    const prUrl = pr.html_url;
  
    // Extract issue number from PR body
    const match = prBody.match(/fix_issue#(\d+)/i);
    if (!match) {
      context.log.warn(`❗ PR #${prNumber} merged without issue reference.`);
      await context.octokit.issues.createComment({
        owner,
        repo,
        issue_number: prNumber,
        body: `⚠️ @${contributorUsername}, your PR was merged, but we couldn't find a related issue number using \`fix_issue#<number>\`. No bounty will be sent.`,
      });
      return;
    }
  
    const issueNumber = match[1];
    console.log("Issue number from merged PR:", issueNumber);
  
    // Fetch bounty info
    const bounty = await db
      .select()
      .from(BOUNTIES)
      .where(
        and(eq(BOUNTIES.repoId, repoId), eq(BOUNTIES.issueNumber, issueNumber))
      );
  
    console.log("Bounty fetched:", bounty);
    if (!bounty.length) {
      context.log.warn(`No bounty found for issue #${issueNumber}`);
      return;
    }
  
    const amount = bounty[0].amount;
  
    // Fetch Maintainer and Contributor users
    const MaintainerUser = await db
      .select()
      .from(USER_TABLE)
      .where(eq(USER_TABLE.githubId, mergerGithubId));
  
    const ContributorUser = await db
      .select()
      .from(USER_TABLE)
      .where(eq(USER_TABLE.githubId, contributorGithubId));
  
    if (!MaintainerUser.length || !ContributorUser.length) {
      context.log.error("❌ Missing Maintainer or Contributor user data.");
      return;
    }
  
    // Notify that PR merged
    await context.octokit.issues.createComment({
      owner,
      repo,
      issue_number: prNumber,
      body: `🎉 @${contributorUsername}'s PR #${prNumber} was merged! Bounty for issue #${issueNumber} will now be processed.`,
    });
    try {
      const response = await axios.post(
        "https://forkup.vercel.app/api/send-bounty",
        {
          repo: `${owner}/${repo}`,
          prNumber,
          mergedBy: mergerUsername,
          maintainerPrivyId: MaintainerUser[0].userId,
          contributorPrivyId: ContributorUser[0].userId,
          prUrl,
          contributorGithubId,
          contributorUsername,
          repoOwnerUsername: owner,
          repoOwnerGithubId: context.payload.repository.owner.id.toString(),
          amount,
        }
      );
  
      const txHash = response.data;
      // 🛠 Update bounty entry properly now
      await db.update(BOUNTIES)
        .set({
          status: "closed",
          contributorId: ContributorUser[0].username, // setting the solver
          prLink: prUrl,                         // link to merged PR
          mergedAt: new Date(),                  // now
        })
        .where(
          and(eq(BOUNTIES.repoId, repoId), eq(BOUNTIES.issueNumber, issueNumber))
        );
  
      await context.octokit.issues.createComment({
        owner,
        repo,
        issue_number: prNumber,
        body: `💰 Bounty of ${amount} SOL sent to @${contributorUsername}'s wallet.\n\n🔗 [View Transaction on Solscan (Devnet)](https://solscan.io/tx/${txHash}?cluster=devnet)`,
      });
    } catch (error) {
      context.log.error("❌ Error sending bounty:", error);
    
      // Check if it's a 400 error
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        await context.octokit.issues.createComment({
          owner,
          repo,
          issue_number: prNumber,
          body: `🚨 Maintainer does not have enough balance to pay the bounty for @${contributorUsername}. Please contact the maintainer.`,
        });
      } else {
        // Other errors
        await context.octokit.issues.createComment({
          owner,
          repo,
          issue_number: prNumber,
          body: `🚨 Failed to send bounty to @${contributorUsername}. Please contact support.`,
        });
      }
    }
  });
  
};

export default app;
