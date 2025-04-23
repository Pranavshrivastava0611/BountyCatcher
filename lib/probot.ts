// lib/probot.ts
import { Probot } from "probot";


const probot = new Probot({
  appId: process.env.APP_ID!,
  privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
  secret: process.env.WEBHOOK_SECRET!,
});

export default probot;
