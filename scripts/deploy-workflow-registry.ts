import hre from "hardhat";

const { viem } = await hre.network.connect();

const registry = await viem.deployContract("WorkflowRegistry");

console.log(`WorkflowRegistry deployed to: ${registry.address}`);
