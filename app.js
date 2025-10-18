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
  } catch (err) {
    console.error(err);
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

  const rewardRate = 0.025; // 2.5% APR simple simulation
  const reward = amount * rewardRate;

  const data = {
    wallet: connectedWallet,
    amount: amount,
    reward: reward,
    timestamp: new Date().toISOString()
  };

  document.querySelector("#status").textContent = "⏳ Saving to 4EVERLAND...";

  try {
    const res = await fetch(
      `https://endpoint.4everland.dev/ardion-staking-data/${connectedWallet}.json`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer YOUR_ACCESS_KEY"
        },
        body: JSON.stringify(data)
      }
    );

    if (res.ok) {
      document.querySelector("#status").textContent = "✅ Stake recorded successfully!";
      console.log("Data saved:", data);
    } else {
      document.querySelector("#status").textContent = "❌ Failed to save data.";
      console.error(await res.text());
    }
  } catch (err) {
    console.error(err);
    document.querySelector("#status").textContent = "⚠️ Error saving data.";
  }
});
