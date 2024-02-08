const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const DkcStakingRewardsUpgradeable = artifacts.require("DkcStakingRewardsUpgradeable");

module.exports = async function (deployer, network, accounts) {
  if (network === 'bscmainnet' || network === 'bscmainnet-fork') {
    const dkcTokenAddress = '0x154A9F9cbd3449AD22FDaE23044319D6eF2a1Fab';

    await deployProxy(DkcStakingRewardsUpgradeable, [accounts[0], accounts[0], dkcTokenAddress, dkcTokenAddress, 7 * 24 * 60 * 60], { deployer });
  }
};
