## 🚀 How to Use ForkUp

ForkUp makes it easy to reward open source contributions with SOL as soon as a pull request is merged. Here's how to set it up and start using it:

---

### ✅ 1. Install the ForkUp GitHub App

To get started, install the ForkUp GitHub App on your repository:

👉 [Install ForkUp GitHub App](https://github.com/apps/forkupApp)

> 🔐 You’ll need to be an admin of the repository to install the app.  
> 📌 Grant access to the repositories where you want to enable bounties.

---

### 🔗 2. Connect Your Wallet

Go to [https://forkup.vercel.app](https://forkup.vercel.app) and:

1. Log in using your GitHub account.
2. Link your **Solana wallet** using the embedded **Privy wallet connector**.
3. Maintainers and contributors both need to complete this step.

---

### 💬 3. Register a Bounty

As a **maintainer**, once your wallet is linked and the app is installed, go to a GitHub issue or pull request and leave a comment like: /registerBounty 2SOL https://github.com/Pranavshrivastava0611/BountyCatcher/


This will:

- Attach a bounty of **2 SOL** to the repository.
- Let ForkUp know you're ready to reward accepted contributions.

> ℹ️ You can change the amount (e.g., `1.5SOL`, `5SOL`, etc.)

---

### 🔁 4. Contribute to the Repository

As a **contributor**:

1. Visit [ForkUp](https://forkup.vercel.app) and connect your wallet.
2. Submit a pull request to a bounty-enabled repo.
3. Once your PR is merged, ForkUp will automatically detect the merge and trigger a **SOL transfer** to your wallet — instantly and trustlessly.

---

### 🛠️ 5. (Optional) Run ForkUp Locally

Want to run ForkUp locally for development?

#### Step 1: Clone the Repo

```bash
git clone https://github.com/Pranavshrivastava0611/ForkUp.git
cd ForkUp
```
#### Step 2 : Install Dependencies
```bash
npm install
```
#### Step 3 : Add Environment Variables
```bash
Create a .env.local file and configure it like this:
# Frontend
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# GitHub App Credentials
GITHUB_APP_ID=your_app_id
GITHUB_APP_SECRET=your_client_secret
GITHUB_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
PROBOT_WEBHOOK_SECRET=your_webhook_secret

# Database
DATABASE_URL=your_database_url

# Blockchain
SOLANA_NETWORK=devnet
```

#### Step 4 : Start the App
```bash
npm run dev
```
You’re now ready to run and test ForkUp locally!
For live use, just install the GitHub App and connect wallets on forkup.vercel.app.

