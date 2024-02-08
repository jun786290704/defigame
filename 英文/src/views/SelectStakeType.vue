<template>
  <div class="body main-font">
    <ul class="stake-select-list" v-if="true">
      <li class="stake-select-item" v-for="e in entries" :key="e.stakeType">
        <stake-selector-item
          :stakeTitle="e.stakeTitle"
          :stakeTokenName="e.stakeTokenName"
          :rewardTokenName="e.rewardTokenName"
          :stakeType="e.stakeType"
          :minimumStakeTime="stakeOverviews[e.stakeType].minimumStakeTime"
          :estimatedYield="estimatedYields[e.stakeType]"
          :deprecated="e.deprecated" />
      </li>
    </ul>
    <div class="loading-indicator" v-else>
      <h1>Loading...</h1>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import BN from 'bignumber.js';
import _ from 'lodash';
BN.config({ ROUNDING_MODE: BN.ROUND_DOWN });
BN.config({ EXPONENTIAL_AT: 100 });
import StakeSelectorItem from '../components/StakeSelectorItem.vue';

import { humanReadableDetailsForStakeTypes } from '../stake-types';

export default {
  components: {
    StakeSelectorItem,
  },

  computed: {
    ...mapState(['stakeOverviews']),
    ...mapGetters(['availableStakeTypes']),

    entries() {
      return this.availableStakeTypes.map(stakeType => ({
        stakeType, ...humanReadableDetailsForStakeTypes[stakeType]
      }));
    },

    estimatedYields() {
      return _.fromPairs(
        this.availableStakeTypes.map(stakeType => [
          stakeType,
          this.calculateEstimatedYield(stakeType)
        ])
      );
    },
  },

  methods: {
    ...mapActions(['fetchStakeOverviewData']),

    calculateEstimatedYield(stakeType) {
      const rewardRate = this.stakeOverviews[stakeType].rewardRate;
      const totalStaked = this.stakeOverviews[stakeType].totalSupply;

      const rewardsPerDay = BN(rewardRate).multipliedBy(365.24 * 24 * 60 * 60);

      const totalSupply = BN(totalStaked);

      const estYield = rewardsPerDay.dividedBy(totalSupply);

      if(stakeType === 'lp' || stakeType === 'lp2') {
        return estYield.multipliedBy(0.102); // temporary, fetch from pancakeswap instead in the future
      }

      return estYield;
    }
  },

  async mounted() {
    await this.fetchStakeOverviewData();
  }
};
</script>

<style scoped>
.stake-select-list {
  list-style: none;
  margin: 0 auto;
  padding: 0;
  display: flex;
  max-width: 80rem;
  justify-content: center;
  flex-wrap: wrap;
  width: 70%; /* 侧边栏占据视口宽度的25% */
  height: 70%; /* 侧边栏占据视口高度的50% */
  flex: 0 0 2000px; /* 根据需要调整宽度 */
  height: 80vh; /* 侧边栏高度，可根据需求调整 */
  position: fixed; /* 固定定位 */
  right: 0; /* 右对齐 */
  bottom: 0; /* 底对齐 */
  z-index: 1000; /* 层叠上下文顺序 */
  overflow-y: auto; /* 允许垂直方向滚动 */
  overflow-x: hidden; /* 隐藏水平滚动条 */
}

.stake-select-item {
  width: 17rem;
  height: 22rem;
  margin: 2rem;
  border-radius: 1rem;
  overflow: hidden;
  border: 2px solid #6c5f38;
  border-radius: 0.1em;
}

.stake-select-item > * {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.loading-indicator {
  min-height: 8rem;
  display: flex;
  justify-content: center;
}

.loading-indicator h1 {
  margin: 3rem;
  display: inline-block;
}
</style>
