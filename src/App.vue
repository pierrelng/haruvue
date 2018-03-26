<template>
  <div id="app">
    <router-view></router-view>
    <bottom-player></bottom-player>
    <!-- <bottom-nav></bottom-nav> -->
  </div>
</template>

<script>
import BottomPlayer from '@/components/BottomPlayer/BottomPlayer';
import BottomNav from '@/components/BottomNav/BottomNav';

export default {
  name: 'app',
  components: {
    'bottom-player': BottomPlayer,
    'bottom-nav': BottomNav,
  },
};
</script>

<style lang="stylus" src="./App.styl"></style>
