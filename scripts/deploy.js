
const hre = require("hardhat");

async function main() {
  // 1. Deploy the Whitelist contract first
  const Whitelist = await hre.ethers.getContractFactory("Whitelist");
  const whitelist = await Whitelist.deploy();
  await whitelist.waitForDeployment();
  const whitelistAddress = whitelist.target;

  console.log(`Whitelist contract deployed to: ${whitelistAddress}`);

  // 2. Deploy the SecurityToken, passing the Whitelist address to its constructor
  const SecurityToken = await hre.ethers.getContractFactory("SecurityToken");
  const securityToken = await SecurityToken.deploy(whitelistAddress);
  await securityToken.waitForDeployment();
  const tokenAddress = securityToken.target;

  console.log(`SecurityToken contract deployed to: ${tokenAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
