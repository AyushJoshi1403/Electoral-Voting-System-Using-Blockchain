// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const ElectionSystem = await hre.ethers.getContractFactory("ElectionSystem");
  const electionSystem = await ElectionSystem.deploy();
  await electionSystem.deployed();

  console.log("ElectionSystem deployed to:", electionSystem.address);
  
  // To make it easy to copy and paste into our frontend
  console.log("Replace YOUR_DEPLOYED_CONTRACT_ADDRESS in pages/index.tsx with:", electionSystem.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});