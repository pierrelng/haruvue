<template>
  <div class="categories container">
    <router-link class="categories__item full-row soiree" :to="{ name: 'Tag', params: { tag: 'allnightlong' }}">Soirées</router-link>
    <router-link class="categories__item concert" :to="{ name: 'Tag', params: { tag: 'concert' }}">Concerts</router-link>
    <router-link class="categories__item gratuit" :to="{ name: 'Tag', params: { tag: 'gratuit' }}">Gratuit</router-link>
    <router-link class="categories__item full-row coupdecoeur" :to="{ name: 'Tag', params: { tag: 'coupdecoeur' }}">Coups de coeur</router-link>
    <router-link class="categories__item early" :to="{ name: 'Tag', params: { tag: 'early' }}">Early</router-link>
    <router-link class="categories__item after" :to="{ name: 'Tag', params: { tag: 'after' }}">After</router-link>
    <router-link class="categories__item full-row djset" :to="{ name: 'Tag', params: { tag: 'djset' }}">DJset</router-link>
    <router-link class="categories__item house" :to="{ name: 'Tag', params: { tag: 'house' }}">House</router-link>
    <router-link class="categories__item hiphop" :to="{ name: 'Tag', params: { tag: 'hiphop' }}">Hip Hop</router-link>
    <router-link class="categories__item rock" :to="{ name: 'Tag', params: { tag: 'rock' }}">Rock</router-link>
    <router-link class="categories__item jazz" :to="{ name: 'Tag', params: { tag: 'jazz' }}">Jazz</router-link>
    <router-link class="categories__item full-row chill" :to="{ name: 'Tag', params: { tag: 'chill' }}">Chill</router-link>
    <router-link class="categories__item full-row happy" :to="{ name: 'Tag', params: { tag: 'happy' }}">Happy</router-link>
    <router-link class="categories__item full-row festif" :to="{ name: 'Tag', params: { tag: 'festif' }}">Festif</router-link>
    <router-link class="categories__item full-row rave" :to="{ name: 'Tag', params: { tag: 'rave' }}">Rave</router-link>
  </div>
</template>

<script>
export default {
  name: 'categories',
};
</script>

<style scoped lang="stylus" src="./Categories.styl"></style>
