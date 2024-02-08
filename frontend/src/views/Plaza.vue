<template>
  <div class="d-flex">
    <div class="sidebar">
      <div class="container">
        <div class="row">
          <div class="body main-font">

            <div v-if="ownCharacters.length === 0" class="blank-slate">
              <div class="current-promotion">
                <div class="tob-bg-img promotion-decoration">
                  <img class="vertical-decoration bottom" src="../assets/border-element.png">
                </div>
                <strong class="upper-text">Start earning today!</strong>
                <div class="bot-bg-img promotion-decoration">
                    <img src="../assets/border-element.png">
                </div>
              </div>
              <big-button
                class="button"
                :mainText="`Recruit character for ${recruitCost} DKC`"
                :disabled="!canRecruit()"
                @click="onMintCharacter"
                tagname="recruit_character"
              />
              <div v-if="formatDkc() < recruitCost" >
                <br>
                You can buy more DKC from <a v-bind:href="`${getExchangeUrl}`" target="_blank">here</a>.
              </div>
            </div>
            <div class="row mt-3" v-if="ownCharacters.length > 0">
              <div class="col">
                <div v-if="ownCharacters.length > 0">
                  <div class="d-flex justify-content-space-between">
                    <!-- <h1>Characters ({{ ownCharacters.length }} / 4)</h1> -->

                    <b-button
                      v-if="ownCharacters.length < 4"
                      :disabled="!canRecruit()"
                      variant="primary"
                      class="ml-auto gtag-link-others"
                      @click="onMintCharacter"
                      v-tooltip="'Recruit new character'" tagname="recruit_character">
                      Recruit ({{ recruitCost }} NON-IGO DKC) <i class="fas fa-plus"></i>
                    </b-button>
                  </div>

                  <character-list
                    :value="currentCharacterId"
                    @input="setCurrentCharacter"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BN from 'bignumber.js';

import BigButton from '../components/BigButton.vue';
import CharacterList from '../components/smart/CharacterList.vue';
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import { fromWeiEther, toBN } from '../utils/common';

export default {
  computed: {
    ...mapState(['characters', 'maxStamina', 'currentCharacterId', 'defaultAccount', 'dkcBalance']),
    ...mapGetters([
      'contracts',
      'ownCharacters',
      'ownWeapons',
      'currentCharacter',
      'currentCharacterStamina',
      'getCharacterName',
      'getExchangeUrl',
    ]),

    character() {
      if (!this.currentCharacter) {
        return {
          id: null,
          name: '???',
          level: -1,
          experience: -1,
        };
      }

      const c = this.currentCharacter;
      return {
        id: c.id,
        name: this.getCharacterName(c.id),
        level: c.level,
        experience: c.xp,
      };
    },
  },

  async created() {
    const recruitCost = await this.contracts.CryptoBlades.methods.mintCharacterFee().call({ from: this.defaultAccount });
    const dkcRecruitCost = await this.contracts.CryptoBlades.methods.usdToDkc(recruitCost).call();
    this.recruitCost = BN(dkcRecruitCost).div(BN(10).pow(18)).toFixed(4);

    console.log(this.recruitCost, this.formatDkc());
  },

  data() {
    return {
      recruitCost: this.recruitCost
    };
  },

  methods: {
    ...mapMutations(['setCurrentCharacter']),
    ...mapActions(['mintCharacter']),

    async onMintCharacter() {
      try {
        await this.mintCharacter();
      } catch (e) {
        this.$dialog.notify.error('Could not mint character: insufficient funds or transaction denied.');
      }
    },
    formatDkc() {
      return fromWeiEther(this.dkcBalance);
    },
    canRecruit() {
      const cost = toBN(this.recruitCost);
      const balance = toBN(this.dkcBalance);
      return balance.isGreaterThanOrEqualTo(cost);
    }
  },

  components: {
    BigButton,
    CharacterList,
  },
};
</script>

<style scoped>

.d-flex {
  display: flex;
  height: 10vh;

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

.current-promotion {
  width: 40%;
  text-align: center;
}

@media all and (max-width:  767.98px) {
  .current-promotion {
    width: 100vw;
    margin-top: 90px;
    padding-left: 15px;
  }
}

.promotion-decoration {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
  margin-bottom: 10px;
}

.upper-text {
  text-transform: uppercase;
}
</style>
