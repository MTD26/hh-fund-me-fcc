const { network } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
// const { verify } = require("../utils/verify");
require("dotenv").config();
const { verify } = require("../utils/verify.js");

/* -- This commented piece is similar to the function below. its useful to understand it

function deployFunc(hre) {
  console.log("Hello world!");
  hre.getNanedAccounts()
}

module.exports.default = deployFunc; */

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  //if chaindId = x then do Y
  //
  let ethUsdPriceFeedAddress;
  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }

  const args = [ethUsdPriceFeedAddress];
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [ethUsdPriceFeedAddress], // put price feed addrresss
    log: true,
    waitConfirmations: network.config.blockconfirmations || 1,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(fundMe.address, args);
  }
  log("------------------------------26---------------------------------");
};
module.exports.tags = ["all", "fundme"];
