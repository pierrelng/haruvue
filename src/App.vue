<template>
  <div id="app">
    <router-view></router-view>
    <bottom-nav></bottom-nav>
  </div>
</template>

<script>
import BottomNav from '@/components/BottomNav/BottomNav';

export default {
  name: 'app',
  components: {
    'bottom-nav': BottomNav,
  },
};
</script>

<style lang="stylus" src="./App.styl"></style>
