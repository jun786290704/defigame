import { allStakeTypes, isStakeType, StakeType } from './interfaces';

let availableStakingContracts = allStakeTypes;

if(process.env.VUE_APP_STAKE_TYPES_AVAILABLE) {
  availableStakingContracts = process.env.VUE_APP_STAKE_TYPES_AVAILABLE
    .split(',')
    .filter(isStakeType);
}

export interface StakingContractEntry {
  stakingRewardsAddress: string;
  stakingTokenAddress: string;
}

export const stakingContractsInfo: Partial<Record<StakeType, Partial<StakingContractEntry>>> = {
  dkc: {
    stakingRewardsAddress: process.env.VUE_APP_DKC_STAKING_REWARDS_CONTRACT_ADDRESS,
    stakingTokenAddress: process.env.VUE_APP_DKC_TOKEN_CONTRACT_ADDRESS
  }
};

if(availableStakingContracts.includes('dkc2')) {
  stakingContractsInfo.dkc2 = {
    stakingRewardsAddress: process.env.VUE_APP_DKC2_STAKING_REWARDS_CONTRACT_ADDRESS,
    stakingTokenAddress: process.env.VUE_APP_DKC2_TOKEN_CONTRACT_ADDRESS
  };
}

if(availableStakingContracts.includes('lp')) {
  stakingContractsInfo.lp = {
    stakingRewardsAddress: process.env.VUE_APP_LP_STAKING_REWARDS_CONTRACT_ADDRESS,
    stakingTokenAddress: process.env.VUE_APP_LP_TOKEN_CONTRACT_ADDRESS
  };
}

if(availableStakingContracts.includes('lp2')) {
  stakingContractsInfo.lp2 = {
    stakingRewardsAddress: process.env.VUE_APP_LP_2_STAKING_REWARDS_CONTRACT_ADDRESS,
    stakingTokenAddress: process.env.VUE_APP_LP_2_TOKEN_CONTRACT_ADDRESS
  };
}

interface HumanReadableDetailsForStakeType {
  stakeTokenName: string;
  rewardTokenName: string;
  stakeTitle: string;
  deprecated?: boolean;
}

const defaultHumanReadableDetailsForStakeTypes: Record<StakeType, HumanReadableDetailsForStakeType> = {
  dkc: {
    stakeTokenName: 'DKC',
    rewardTokenName: 'DKC',
    stakeTitle: 'DKC for DKC (Old)',
    deprecated: true
  },
  dkc2: {
    stakeTokenName: 'DKC',
    rewardTokenName: 'DKC',
    stakeTitle: 'DKC for DKC'
  },
  lp: {
    stakeTokenName: 'DKC-WBNB',
    rewardTokenName: 'DKC',
    stakeTitle: 'DKC-WBNB for DKC'
  },
  lp2: {
    stakeTokenName: 'DKC-BNB',
    rewardTokenName: 'DKC',
    stakeTitle: 'DKC-BNB for DKC V2'
  },
};

export const humanReadableDetailsForStakeTypes = defaultHumanReadableDetailsForStakeTypes;

const stakeTypeForUnclaimedRewards = process.env.VUE_APP_STAKE_TYPE_FOR_UNCLAIMED_REWARDS;

export const stakeTypeThatCanHaveUnclaimedRewardsStakedTo: StakeType =
  stakeTypeForUnclaimedRewards && isStakeType(stakeTypeForUnclaimedRewards)
    ? stakeTypeForUnclaimedRewards
    : 'dkc';
