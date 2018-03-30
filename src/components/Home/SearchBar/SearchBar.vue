<template>
  <div>

    <form class="form" @submit.prevent>
      <input class="form__input" v-model="query" placeholder="Filtrer avec un tag" ref="searchInput">
      <div class="clear" @click="clear()" v-show="query">X</div>
      <input class="form__submit" type="submit" @click="search(query.toLowerCase())" value="">
      <router-link class="categoriesButton" :to="{ name: 'Categories', params: { origin: 'home' }}"></router-link>
    </form>

  </div>
</template>

<script>
import bus from '@/main';

export default {
  name: 'search-bar',
  data() {
    return {
      query: '',
    };
  },
  created() {
    if (this.$route.params.tag) {
      this.query = this.$route.params.tag;
    }
    bus.$on('tagClicked', (tag) => {
      this.query = tag;
      this.search(tag);
    });
  },
  methods: {
    search(data) {
      // emit event with payload (searched tag) -> bus -> catched by EventList.vue -> update list accordingly
      bus.$emit('search', data);
      if (this.$route.query.j) {
        this.$router.push({ name: 'Tag', params: { tag: data }, query: { j: this.$route.query.j } });
      } else {
        this.$router.push({ name: 'Tag', params: { tag: data } });
      }
    },
    clear() {
      this.query = '';
      bus.$emit('search', '');
      this.$refs.searchInput.focus();
      if (this.$route.query.j) {
        this.$router.push({ path: '/', query: { j: this.$route.query.j } });
      } else {
        this.$router.push({ path: '/' });
      }
    },
  },
  computed: {
    cleanQuery() {
      return this.query.toLowerCase();
    },
  },
};
</script>

<style scoped lang="stylus" src="./SearchBar.styl"></style>
