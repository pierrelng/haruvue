<template>
  <div>
    <ul class="list"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="infiniteScrollDisabled"
        infinite-scroll-distance="100"
        infinite-scroll-immediate-check="false">
      <li v-for="event in events">
        <span v-html="event.title.rendered"></span>
        <span>
          {{ [event.details.start_time[0], 'YYYY-MM-DD HH:mm:ss'] | moment('dddd DD MMM [de] HH:mm') }}
          -
          {{ [event.details.end_time[0], 'YYYY-MM-DD HH:mm:ss'] | moment('HH:mm') }}
        </span>
        <span>{{ event.acf.venue[0].post_title }}</span>
        <a v-bind:href="event.acf.facebook_event_url">
          <img v-bind:src="event.details.cover_source">
        </a>
      </li>
    </ul>
    <p v-show="showSpinner" class="spinner">
      <mt-spinner type="triple-bounce"></mt-spinner>
    </p>
    <p v-show="noEventsFound" style="text-align: center;">Fin de la liste</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'eventList',
  props: ['selectedDay'],
  data() {
    return {
      events: [],
      noEventsFound: false,
      offset: 0,
      infiniteScrollDisabled: false,
      showSpinner: false,
    };
  },
  created() {
    this.getEvents();
  },
  methods: {
    getEvents() {
      this.events = [];
      this.showSpinner = true;
      this.noEventsFound = false;
      setTimeout(() => {
        axios.get(`https://pierrelange.com/wp-json/haru/v1/events?offset=0&selected_day=${this.selectedDay}`)
        .then((response) => {
          this.noEventsFound = false;
          this.events = response.data;
          this.showSpinner = false;
        })
        .catch(() => {
          this.showSpinner = false;
          this.noEventsFound = true;
        });
      }, 5);
    },
    loadMore() {
      this.infiniteScrollDisabled = true;
      this.showSpinner = true;
      setTimeout(() => {
        this.offset = this.events.length;
        axios.get(`https://pierrelange.com/wp-json/haru/v1/events?offset=${this.offset}&selected_day=${this.selectedDay}`)
        .then((response) => {
          this.noEventsFound = false;
          response.data.forEach((event) => {
            this.events.push(event);
          });
          this.showSpinner = false;
          this.infiniteScrollDisabled = false;
        })
        .catch(() => {
          this.showSpinner = false;
          this.noEventsFound = true;
          this.offset = 0;
        });
      }, 5);
    },
  },
  watch: {
    selectedDay() {
      this.infiniteScrollDisabled = false;
      this.getEvents();
    },
  },
};
</script>

<style scoped lang="stylus" src="./EventList.styl"></style>
