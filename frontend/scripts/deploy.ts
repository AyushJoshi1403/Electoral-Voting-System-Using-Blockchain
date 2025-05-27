import { ethers } from "hardhat";

async function main() {
  console.log("Deploying VotingSystem smart contract...");

  const electionName = "General Election 2025";
  
  const VotingSystem = await ethers.getContractFactory("VotingSystem");
  const votingSystem = await VotingSystem.deploy(electionName);

  await votingSystem.waitForDeployment();

  const address = await votingSystem.getAddress();
  console.log(`VotingSystem deployed to: ${address}`);

  // Add some initial candidates for testing
  console.log("Adding initial candidates...");
  
  await votingSystem.addCandidate("John Doe", "Party A", "Building a better future");
  await votingSystem.addCandidate("Jane Smith", "Party B", "Prosperity for all");
  await votingSystem.addCandidate("Robert Johnson", "Party C", "Security and growth");

  console.log("Setup complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
