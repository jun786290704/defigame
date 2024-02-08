const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const DkcStakingRewardsUpgradeable = artifacts.require("DkcStakingRewardsUpgradeable");
const LPStakingRewardsUpgradeable = artifacts.require("LPStakingRewardsUpgradeable");
const LP2StakingRewardsUpgradeable = artifacts.require("LP2StakingRewardsUpgradeable");
const CryptoBlades = artifacts.require("CryptoBlades");

module.exports = async function (deployer, network, accounts) {
  await upgradeProxy(LPStakingRewardsUpgradeable.address, LPStakingRewardsUpgradeable, { deployer });
  await upgradeProxy(LP2StakingRewardsUpgradeable.address, LP2StakingRewardsUpgradeable, { deployer });

  const dkcStakingRewards = await upgradeProxy(DkcStakingRewardsUpgradeable.address, DkcStakingRewardsUpgradeable, { deployer });

  const game = await upgradeProxy(CryptoBlades.address, CryptoBlades, { deployer });

  await game.migrateTo_23b3a8b(dkcStakingRewards.address);
  await dkcStakingRewards.migrateTo_23b3a8b(game.address);
};
