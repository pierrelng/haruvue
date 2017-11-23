<template>
  <div>

    <form class="form" @submit.prevent>
      <input class="form__input" v-model="query" placeholder="(1 seul tag par recherche for now...)">
      <input class="form__submit" type="submit" @click="search(query)" value="">
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
  methods: {
    search(data) {
      // emit event with payload (searched tag) -> bus -> catched by EventList.vue -> update list accordingly
      bus.$emit('search', data);
    },
  },
};
</script>

<style scoped lang="stylus" src="./SearchBar.styl"></style>
