
import { pgTable, uuid, text, timestamp,json } from 'drizzle-orm/pg-core';



export const USER_TABLE = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId : text('user_id').notNull().unique(),
  githubId: text('github_id').unique().notNull(),
  username: text('username').notNull(),
  email: text('email'),
  privyWallet: text('privy_wallet'),
  role: text('role').notNull(), // "contributor" | "maintainer" | "admin"
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const REPOS = pgTable("repositories", {
  id: uuid("id").defaultRandom().primaryKey(),
  githubRepoId: text("github_repo_id").unique().notNull(),
  owner: text("owner").notNull(),
  name: text("name").notNull(),
  fullName: text("full_name").notNull(),
  installationId: text("installation_id").notNull(),
  registeredById: uuid("registered_by_id")
    .notNull()
    .references(() => USER_TABLE.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

  export const BOUNTIES = pgTable('bounties', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    amount: text('amount').notNull(),
    tokenType: text('token_type').notNull(), // e.g., SOL, USDC
    repoId: text('repo_id').notNull(),
    repoInfo : json('repo_info').notNull(), // JSON object containing repo details
    repoLink: text('repo_link').notNull(),
    issueNumber: text('issue_number'),
    status: text('status').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  });

  export const PULL_REQUEST = pgTable("pull_requests", {
    id: uuid("id").defaultRandom().primaryKey(),
    prNumber: text("pr_number").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    status: text("status").notNull(), // open | merged | rejected
    contributorId: text("contributor_id").notNull(),
    bountyId: text("bounty_id"),
    repoId: text("repo_id").notNull(),
    githubUrl: text("github_url").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  });
  
  export const TRANSACTIONS = pgTable('transactions', {
    id: uuid('id').defaultRandom().primaryKey(),
    prId: text('pr_id').notNull(),
    contributor : text('contributor').notNull(),
    maintainer: text('maintainer').notNull(),
    amount: text('amount').notNull(),
    tokenType: text('token_type').notNull(),
    txHash: text('tx_hash').notNull(),
    status: text('status').notNull(), // pending | success | failed
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  });


// export const WEBHOOK_EVENT = pgTable('webhook_events', {
//   id: uuid('id').defaultRandom().primaryKey(),
//   eventType: text('event_type').notNull(),
//   payload: json('payload').notNull(),
//   receivedAt: timestamp('received_at', { withTimezone: true }).defaultNow(),
// });


