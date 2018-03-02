<template>
  <div id="app">
    <router-view></router-view>
    <bottom-player></bottom-player>
  </div>
</template>

<script>
import BottomPlayer from '@/components/BottomPlayer/BottomPlayer';

export default {
  name: 'app',
  components: {
    'bottom-player': BottomPlayer,
  },
};
</script>

<style lang="stylus" src="./App.styl"></style>
