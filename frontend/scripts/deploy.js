const hre = require("hardhat");

async function main() {
  const ElectionSystem = await hre.ethers.getContractFactory("ElectionSystem");
  const electionSystem = await ElectionSystem.deploy();
  await electionSystem.deployed();
  console.log("ElectionSystem deployed to:", electionSystem.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });