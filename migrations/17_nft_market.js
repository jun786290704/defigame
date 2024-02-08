const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const DkcToken = artifacts.require("DkcToken");
const CryptoBlades = artifacts.require("CryptoBlades");
const NFTMarket = artifacts.require("NFTMarket");

module.exports = async function (deployer, network) {
  let dkcTokenAddress;
  if (network === 'bscmainnet' || network === 'bscmainnet-fork') {
    dkcTokenAddress = '0x154a9f9cbd3449ad22fdae23044319d6ef2a1fab';
  }
  else {
    dkcTokenAddress = DkcToken.address;
  }

  await deployProxy(NFTMarket, [dkcTokenAddress, CryptoBlades.address], { deployer });
};
