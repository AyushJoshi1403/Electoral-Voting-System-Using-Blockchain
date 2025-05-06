const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const ElectionSystem = await hre.ethers.getContractFactory("ElectionSystem");
  const electionSystem = await ElectionSystem.deploy();
  await electionSystem.waitForDeployment();
  
  const address = await electionSystem.getAddress();
  console.log("ElectionSystem deployed to:", address);

  // Save contract address to frontend/src/contract-address.json
  const addressPath = path.join(__dirname, "../src/contract-address.json");
  fs.writeFileSync(addressPath, JSON.stringify({ address }, null, 2));
  console.log(`Contract address saved to ${addressPath}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });