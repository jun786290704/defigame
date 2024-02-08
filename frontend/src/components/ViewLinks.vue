<template>
  <b-navbar-nav>

    <router-link :to="{ name: 'plaza' }" exact class="nav-link"
    v-if="!featureFlagStakeOnly">
      <li class="nav-item nav-top-links">
        <span class="gtag-link-others" tagname="plaza_screen">大厅</span>
      </li>
    </router-link>

    <router-link :to="{ name: 'blacksmith' }" exact class="nav-link"   v-if="!featureFlagStakeOnly">
      <li class="nav-item nav-top-links" >
        <span class="gtag-link-others" tagname="blacksmith_screen">背包</span>
      </li>
    </router-link>

    <router-link :to="{ name: 'combat' }" exact class="nav-link"  v-if="!featureFlagStakeOnly">
      <li class="nav-item nav-top-links" >
        <span class="gtag-link-others" tagname="combat_screen">战斗</span>
      </li>
    </router-link>

    <router-link :to="{ name: 'raid' }" exact class="nav-link"  v-if="!featureFlagStakeOnly && featureFlagRaid">
      <li class="nav-item nav-top-links">
        <span class="gtag-link-others" tagname="raid_screen">Raid</span>
      </li>
    </router-link>

    <router-link :to="{ name: 'market' }" exact class="nav-link" v-if="!featureFlagStakeOnly && featureFlagMarket">
      <li class="nav-item nav-top-links">
        <span class="gtag-link-others" tagname="market_screen">市场</span>
      </li>
    </router-link>

    <router-link :to="{ name: 'select-stake-type' }" exact class="nav-link">
      <li class="nav-item nav-top-links">
        <span class="gtag-link-others" tagname="stake_screen">质押</span>
      </li>
    </router-link>

  </b-navbar-nav>
</template>
<!-- <template>
<div class="d-flex">
  <div class="sidebar">
      <nav>
        <ul class="nav flex-column">
          <li v-if="!featureFlagStakeOnly" class="nav-item">
            <router-link to="{ name: 'plaza' }" class="nav-link">
              Plaza
            </router-link>
          </li>
          <li v-if="!featureFlagStakeOnly" class="nav-item">
            <router-link to="{ name: 'blacksmith' }" class="nav-link">
              Blacksmith
            </router-link>
          </li>
          <li v-if="!featureFlagStakeOnly" class="nav-item">
            <router-link to="{ name: 'combat' }" class="nav-link">
              Combat
            </router-link>
          </li>
          <li v-if="!featureFlagStakeOnly && featureFlagRaid" class="nav-item">
            <router-link to="{ name: 'raid' }" class="nav-link">
              Raid
            </router-link>
          </li>
          <li v-if="!featureFlagStakeOnly && featureFlagMarket" class="nav-item">
            <router-link to="{ name: 'market' }" class="nav-link">
              Market
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="{ name: 'select-stake-type' }" class="nav-link">
              Stake
            </router-link>
          </li>
        </ul>
      </nav>
    </div>

     Main content area where router-view will display the current route's component
    <div class="content">
      <router-view></router-view>
    </div>

  </div>
</template> -->
<script>
import { market as featureFlagMarket, portal as featureFlagPortal } from '../feature-flags';

export default {
  inject: ['featureFlagStakeOnly', 'featureFlagRaid'],

  computed: {
    featureFlagMarket() {
      return featureFlagMarket;
    },
    featureFlagPortal() {
      return featureFlagPortal;
    }
  },
};
</script>

<style scoped>
.d-flex {
  display: flex;
  height: 100vh;
}

.sidebar {
  flex: 0 0 20px; /* Sidebar width */
  background-color: #797878; /* Sidebar background color */
}

.nav {
  width: 100%;
}

.nav-item {
  padding: 10px 15px; /* Padding for nav items */
}

.nav-link {
  color: #BFA765; /* Nav link color */
  font-size: 1.1em; /* Nav link font size */
  font-weight: bold; /* Nav link font weight */
  padding: 50px 1px; /* Nav link padding */
  text-decoration: none; /* Remove underline from links */
}

.nav-link:hover {
  color: #FFF; /* Nav link hover color */
}

.content {
  flex: 1; /* Take remaining space */
  padding: 20px; /* Content area padding */
  overflow: auto; /* Enable scroll if content is too tall */
}
</style>
