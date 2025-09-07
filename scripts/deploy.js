const { ethers } = require("hardhat");

async function main() {
  const Whitelist = await ethers.getContractFactory("Whitelist");
  const whitelist = await Whitelist.deploy();
  await whitelist.deployed();
  console.log("Whitelist deployed to:", whitelist.address);

  const SecurityToken = await ethers.getContractFactory("SecurityToken");
  const securityToken = await SecurityToken.deploy(whitelist.address);
  await securityToken.deployed();
  console.log("SecurityToken deployed to:", securityToken.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
