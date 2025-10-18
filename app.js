// Ardion Staking DApp - Final Version
// Made with ❤️ by Binka

let connectedWallet = null;

// === Connect Wallet ===
document.querySelector("#connectWallet").addEventListener("click", async () => {
  if (!window.solana) {
    alert("Please install a Solana wallet like Phantom first!");
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

// === Handle Stake ===
document.querySelector("#stakeButton").addEventListener("click", async () => {
  const amount = parseFloat(document.querySelector("#stakeAmount").value);

  if (!connectedWallet || isNaN(amount) || amount <= 0) {
    alert("Enter a valid staking amount.");
    return;
  }

  const rewardRate = 0.025; // 2.5% APR simulation
  const reward = amount * rewardRate;

  const data = {
    wallet: connectedWallet,
    amount: amount,
    reward: reward,
    timestamp: new Date().toISOString(),
  };

  document.querySelector("#status").textContent = "⏳ Saving to 4EVERLAND...";
  console.log("📤 Sending data:", data);

  try {
    const res = await fetch(
      `https://endpoint.4everland.dev/ardion-staking-data/${connectedWallet}.json`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Ganti dengan API Key kamu (bukan Secret!)
          "Authorization": "Bearer c34d68751f8a4042bf886446d0a7d048",
        },
        body: JSON.stringify(data),
      }
    );

    if (res.ok) {
      document.querySelector("#status").textContent = "✅ Stake recorded successfully!";
      console.log("✅ Data saved successfully to 4EVERLAND bucket!");
    } else {
      const errText = await res.text();
      document.querySelector("#status").textContent = `❌ Failed: ${res.status}`;
      console.error("❌ Upload failed:", res.status, errText);
    }
  } catch (err) {
    console.error("⚠️ Error saving to 4EVERLAND:", err);
    document.querySelector("#status").textContent = "⚠️ Error saving data.";
  }
});

// === Optional: Auto display connected wallet on reload ===
window.addEventListener("load", async () => {
  if (window.solana && window.solana.isPhantom) {
    try {
      const resp = await window.solana.connect({ onlyIfTrusted: true });
      connectedWallet = resp.publicKey.toString();

      document.querySelector("#walletAddress").textContent = connectedWallet;
      document.querySelector("#walletInfo").classList.remove("hidden");
      document.querySelector("#connectWallet").classList.add("hidden");

      console.log("🔄 Auto reconnected:", connectedWallet);
    } catch (e) {
      console.log("No trusted wallet found, please connect manually.");
    }
  }
});
