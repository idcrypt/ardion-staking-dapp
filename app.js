const connectWalletBtn = document.getElementById("connectWallet");
const stakeForm = document.getElementById("stakeForm");
const statusDiv = document.getElementById("status");

let wallet = null;

connectWalletBtn.addEventListener("click", async () => {
  try {
    const provider = window.solana;
    if (provider && provider.isPhantom) {
      const resp = await provider.connect();
      wallet = resp.publicKey.toString();
      statusDiv.innerHTML = "✅ Connected: " + wallet;
      connectWalletBtn.style.display = "none";
      stakeForm.style.display = "block";
    } else {
      alert("Please install Phantom Wallet!");
    }
  } catch (err) {
    console.error(err);
    statusDiv.innerHTML = "❌ Wallet connection failed.";
  }
});

document.getElementById("stakeButton").addEventListener("click", () => {
  const amount = document.getElementById("stakeAmount").value;
  if (!amount || amount <= 0) {
    alert("Enter valid stake amount");
    return;
  }

  // Display temporary confirmation (off-chain placeholder)
  statusDiv.innerHTML = `📦 You staked ${amount} ARDION tokens! (recorded off-chain for now)`;
});
