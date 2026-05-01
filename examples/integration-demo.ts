Integration Architecture
Aeon Sentinel is designed to be "infrastructure-agnostic," plugging into any existing agent framework.

1. Installation

//Bash
npm install @aeon/sentinel-sdk
2. The Handshake Flow
Initialize the Sentinel SDK within your agent's runtime. Before the agent performs its first move, it must "Open a Vault" using a valid license.

//TYPESCRIPT
...........................................................................

import { AeonSentinelSDK } from "@aeon/sentinel-sdk";

const sentinel = await AeonSentinelSDK.create({
  wallet: agentWallet,
  licenseKey: process.env.AEON_LICENSE_KEY,
  // Official AEON Production Gateway
  supabaseUrl: "https://lsmzdtimauwtuxudsrxd.supabase.co", 
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzbXpkdGltYXV3dHV4dWRzcnhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMTUwMzEsImV4cCI6MjA5Mjg5MTAzMX0.cYpS5bxuk7dq88uUjggaD8SVk9EauA67peDYs0IrrfI"
});

// Initialize the On-Chain Session
const txid = await sentinel.createSession({
  agentPubkey: agentPublicKey,
  maxSpendAmount: new BN(5_000_000), // 0.005 SOL cap
  expirationTime: new BN(expiryTimestamp),
  whitelist: [
    new PublicKey("JUP6LkbZbjS1jKKccwgwsunJqa4nL7D99EwJUX4pTcx"), // Allow Jupiter Swaps
    new PublicKey("6EF8rrecthR5DkwiZghWvDBR6f5SDR2En7AfdeR86uS")  // Allow Pump.fun interactions
  ]
});


..................................................................

The whitelist is a safety filter for the AI agent. In your smart contract logic, it tells the Aeon Sentinel Program exactly which other Solana programs the agent is allowed to interact with.

If the agent tries to send your SOL to a "scam" contract or a program that isn't on that list, the transaction will be blocked on-chain, even if the agent’s private key was used.

What goes in there?
You put the Program IDs (Public Keys) of the protocols you trust the agent to use.

Common Examples for AI Agents:
Jupiter (DEX): JUP6LkbZbjS1jKKccwgwsunJqa4nL7D99EwJUX4pTcx (If the agent needs to swap tokens).

Pump.fun: 6EF8rrecthR5DkwiZghWvDBR6f5SDR2En7AfdeR86uS (If it's a "trench" agent).

Meteora: 24Uqj9J6fMvmbgeu1XoFr4wziSInp6cP8jW9RUR9X (For liquidity).

...................................................................
Note: Even if the SDK source code is modified,
 the Solana Program will reject any transaction that does not contain a 
 valid cryptographic signature from the official Aeon Server.