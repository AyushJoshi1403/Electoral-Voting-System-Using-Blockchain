const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Get the contract factory
  const ElectionSystem = await hre.ethers.getContractFactory("ElectionSystem");
  
  // Deploy the contract
  const electionSystem = await ElectionSystem.deploy();
  
  // Wait for deployment (v6 uses waitForDeployment instead of deployed)
  await electionSystem.waitForDeployment();
  
  // Get contract address (v6 uses getAddress instead of address property)
  const contractAddress = await electionSystem.getAddress();
  console.log("ElectionSystem deployed to:", contractAddress);
  
  // Save the contract address to a file that your frontend can import
  const fs = require("fs");
  fs.writeFileSync(
    "./contract-address.json",
    JSON.stringify({ address: contractAddress }, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });