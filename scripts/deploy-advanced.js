
const hre = require("hardhat");

async function main() {
	console.log("Starting advanced deployment...");

	// 1. Set the Lockup Date (e.g., 30 days from now)
	const lockupTime = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days
	console.log(`Setting lockup for 30 days. Ends at timestamp: ${lockupTime}`);

	// 2. Deploy Rule Contracts
	const KycRule = await hre.ethers.getContractFactory("KycRule");
	const kycRule = await KycRule.deploy();
	await kycRule.waitForDeployment();
	const kycRuleAddress = kycRule.target;
	console.log(`KycRule module deployed to: ${kycRuleAddress}`);

	const LockupRule = await hre.ethers.getContractFactory("LockupRule");
	const lockupRule = await LockupRule.deploy(lockupTime);
	await lockupRule.waitForDeployment();
	const lockupRuleAddress = lockupRule.target;
	console.log(`LockupRule module deployed to: ${lockupRuleAddress}`);

	// 3. Deploy the Registry
	const ComplianceRegistry = await hre.ethers.getContractFactory("ComplianceRegistry");
	const registry = await ComplianceRegistry.deploy();
	await registry.waitForDeployment();
	const registryAddress = registry.target;
	console.log(`ComplianceRegistry deployed to: ${registryAddress}`);

	// 4. Deploy the Token, linking it to the Registry
	const AdvancedSecurityToken = await hre.ethers.getContractFactory("AdvancedSecurityToken");
	const token = await AdvancedSecurityToken.deploy(registryAddress);
	await token.waitForDeployment();
	const tokenAddress = token.target;
	console.log(`AdvancedSecurityToken deployed to: ${tokenAddress}`);

	// --- 5. CRITICAL STEP: Register the rules with the Registry ---
	console.log("Registering rules with the Registry...");
  
	let tx = await registry.addRule(kycRuleAddress);
	await tx.wait();
	console.log("KycRule has been added to the Registry.");

	tx = await registry.addRule(lockupRuleAddress);
	await tx.wait();
	console.log("LockupRule has been added to the Registry.");

	console.log("--- Deployment Complete ---");
	console.log("Token:", tokenAddress);
	console.log("Registry:", registryAddress);
	console.log("KycRule:", kycRuleAddress);
	console.log("LockupRule:", lockupRuleAddress);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
