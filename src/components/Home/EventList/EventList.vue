<template>
  <div>
    <ul class="list"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="100"
        infinite-scroll-immediate-check="false">
      <li v-for="event in events">
        <span v-html="event.title.rendered"></span>
        <span>
          {{ [event.details.start_time[0], 'YYYY-MM-DD HH:mm:ss'] | moment('dddd DD MMM [de] HH:mm') }}
          -
          {{ [event.details.end_time[0], 'YYYY-MM-DD HH:mm:ss'] | moment('HH:mm') }}
        </span>
        <a v-bind:href="event.acf.facebook_event_url">
          <img v-bind:src="event.details.cover_source">
        </a>
      </li>
    </ul>
    <p v-show="loading" class="spinner">
      <mt-spinner type="triple-bounce"></mt-spinner>
    </p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'eventList',
  data() {
    return {
      events: [],
      offset: 0,
      loading: false,
    };
  },
  created() {
    this.getEvents();
  },
  methods: {
    getEvents() {
      axios.get(`https://pierrelange.com/wp-json/haru/v1/events?offset=${this.offset}`)
      .then((response) => {
        this.events = response.data;
      });
    },
    loadMore() {
      this.loading = true;
      setTimeout(() => {
        this.offset = this.events.length;
        axios.get(`https://pierrelange.com/wp-json/haru/v1/events?offset=${this.offset}`)
        .then((response) => {
          response.data.forEach((event) => {
            this.events.push(event);
          });
          this.loading = false;
        });
      }, 5);
    },
  },
};
</script>

<style scoped lang="stylus" src="./EventList.styl"></style>
