// Ardion Staking DApp - Supabase Final Version
// Made with ❤️ by Binka

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = "https://fwgaxkiozldgmmtbdfuf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3Z2F4a2lvemxkZ21tdGJkZnVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3Mzk1MjgsImV4cCI6MjA3NjMxNTUyOH0.QqvfVOk0vMCAfOKOKveIPnCm80PfXsJPQljI1LRtHVk";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let connectedWallet = null;

// --- Connect Wallet ---
document.querySelector("#connectWallet").addEventListener("click", async () => {
  if (!window.solana) {
    alert("Install Phantom Wallet first!");
    return;
  }
  try {
    const resp = await window.solana.connect();
    connectedWallet = resp.publicKey.toString();
    document.querySelector("#walletAddress").textContent = connectedWallet;
    document.querySelector("#walletInfo").classList.remove("hidden");
    document.querySelector("#connectWallet").classList.add("hidden");
    console.log("✅ Wallet connected:", connectedWallet);
  } catch (err) {
    console.error("⚠️ Wallet connection failed:", err);
    alert("Wallet connection failed.");
  }
});

// --- Stake ---
document.querySelector("#stakeButton").addEventListener("click", async () => {
  const val = document.querySelector("#stakeAmount").value;
  const amount = parseFloat(val);
  if (!connectedWallet || isNaN(amount) || amount <= 0) {
    alert("Enter a valid staking amount.");
    return;
  }

  const rewardRate = 0.025; // 2.5% APR
  const reward = parseFloat((amount * rewardRate).toFixed(6));

  const stakeData = {
    wallet: connectedWallet,
    amount,
    reward,
    timestamp: new Date().toISOString()
  };

  document.querySelector("#status").textContent = "⏳ Saving stake...";

  try {
    const { data, error } = await supabase
      .from("stakes")
      .upsert([stakeData], { onConflict: "wallet" });

    if (error) {
      console.error("❌ Error saving stake:", error);
      document.querySelector("#status").textContent = "⚠️ Error saving stake.";
    } else {
      document.querySelector("#status").textContent = "✅ Stake recorded!";
      console.log("✅ Stake saved:", data);
    }
  } catch (err) {
    console.error("⚠️ Unexpected error:", err);
    document.querySelector("#status").textContent = "⚠️ Unexpected error.";
  }
});

// --- Leaderboard ---
async function showLeaderboard() {
  try {
    const { data, error } = await supabase
      .from("stakes")
      .select("*")
      .order("amount", { ascending: false });

    if (error) {
      console.error("❌ Error fetching leaderboard:", error);
      return;
    }

    const table = document.querySelector("#leaderboard tbody");
    table.innerHTML = "";
    data.forEach((item, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${i + 1}</td><td>${item.wallet}</td><td>${item.amount}</td><td>${item.reward}</td>`;
      table.appendChild(tr);
    });
  } catch (err) {
    console.error("⚠️ Unexpected error fetching leaderboard:", err);
  }
}

document.querySelector("#showLeaderboard").addEventListener("click", showLeaderboard);

// --- Auto-reconnect trusted wallet ---
window.addEventListener("load", async () => {
  if (window.solana && window.solana.isPhantom) {
    try {
      const resp = await window.solana.connect({ onlyIfTrusted: true });
      connectedWallet = resp.publicKey.toString();
      document.querySelector("#walletAddress").textContent = connectedWallet;
      document.querySelector("#walletInfo").classList.remove("hidden");
      document.querySelector("#connectWallet").classList.add("hidden");
      console.log("🔄 Auto reconnected:", connectedWallet);
    } catch {
      console.log("No trusted wallet found.");
    }
  }
});
