<template>
  <div>
    <div v-for="event in events" class="list">
      <span v-html="event.title.rendered"></span>
      <a v-bind:href="event.acf.facebook_event_url">Facebookkkkkkkkkkk</a>
      <img v-bind:src="event.details.cover_source">
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'eventList',
  data() {
    return {
      events: [],
    };
  },
  created() {
    this.getEvents();
  },
  methods: {
    getEvents() {
      axios.get('https://pierrelange.com/wp-json/haru/v1/events')
      .then((response) => {
        this.events = response.data;
      });
    },
  },
};
</script>

<style scoped lang="stylus" src="./EventList.styl"></style>
