<template>
  <div class="body main-font">
    <staking class="staking" v-if="isKnownStakeType" :stakeType="stakeType" />
    <h1 v-else>Unknown stake type, please try again.</h1>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Staking from '../components/smart/Staking.vue';
import { isStakeType } from '../interfaces/State';

export default {
  props: {
    stakeType: {
      type: String,
      validator(type) {
        return isStakeType(type);
      }
    }
  },

  computed: {
    ...mapGetters(['availableStakeTypes']),

    isKnownStakeType() {
      return this.availableStakeTypes.includes(this.stakeType);
    }
  },

  components: {
    Staking,
  },
};
</script>

<style scoped>
.body {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sidebar {
  width: 70%; /* 侧边栏占据视口宽度的25% */
  height: 70%; /* 侧边栏占据视口高度的50% */
  flex: 0 0 2000px; /* 根据需要调整宽度 */
  height: 70%; /* 侧边栏高度，可根据需求调整 */
  position: fixed;
   /* 固定定位 */
  background-color: #080808cc;
  right: 0; /* 右对齐 */
  bottom: 0; /* 底对齐 */
  z-index: 1000; /* 层叠上下文顺序 */
  overflow-y: auto; /* 允许垂直方向滚动 */
  overflow-x: hidden; /* 隐藏水平滚动条 */
}

</style>
