<template>
  <div>
    <h1>{{ $route.params.id }}</h1>
    <p>{{ this.event }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'event',
  data() {
    return {
      event: '',
    };
  },
  created() {
    this.getEvent();
  },
  methods: {
    getEvent() {
      axios.get(`https://pierrelange.com/wp-json/haru/v1/events/${this.$route.params.id}`)
      .then((response) => {
        this.event = response.data;
      });
    },
  },
};
</script>

<style scoped lang="stylus" src=""></style>
