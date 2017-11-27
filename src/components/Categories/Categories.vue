<template>
  <div class="categories container">
    <router-link class="categories__item full-row soiree" :to="{ name: 'Home', query: { tag: 'allnightlong' }}">Soirées</router-link>
    <router-link class="categories__item concert" :to="{ name: 'Home', query: { tag: 'concert' }}">Concerts</router-link>
    <router-link class="categories__item gratuit" :to="{ name: 'Home', query: { tag: 'gratuit' }}">Gratuit</router-link>
    <router-link class="categories__item full-row coupdecoeur" :to="{ name: 'Home', query: { tag: 'coupdecoeur' }}">Coups de coeur</router-link>
    <router-link class="categories__item early" :to="{ name: 'Home', query: { tag: 'early' }}">Early</router-link>
    <router-link class="categories__item after" :to="{ name: 'Home', query: { tag: 'after' }}">After</router-link>
    <router-link class="categories__item full-row djset" :to="{ name: 'Home', query: { tag: 'djset' }}">DJset</router-link>
    <router-link class="categories__item house" :to="{ name: 'Home', query: { tag: 'house' }}">House</router-link>
    <router-link class="categories__item hiphop" :to="{ name: 'Home', query: { tag: 'hiphop' }}">Hip Hop</router-link>
    <router-link class="categories__item rock" :to="{ name: 'Home', query: { tag: 'rock' }}">Rock</router-link>
    <router-link class="categories__item jazz" :to="{ name: 'Home', query: { tag: 'jazz' }}">Jazz</router-link>
    <router-link class="categories__item full-row chill" :to="{ name: 'Home', query: { tag: 'chill' }}">Chill</router-link>
    <router-link class="categories__item full-row happy" :to="{ name: 'Home', query: { tag: 'happy' }}">Happy</router-link>
    <router-link class="categories__item full-row festif" :to="{ name: 'Home', query: { tag: 'festif' }}">Festif</router-link>
    <router-link class="categories__item full-row rave" :to="{ name: 'Home', query: { tag: 'rave' }}">Rave</router-link>
  </div>
</template>

<script>
export default {
  name: 'categories',
};
</script>

<style scoped lang="stylus" src="./Categories.styl"></style>
