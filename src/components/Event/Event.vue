<template>
  <div>
    <!-- Img with player -->
    <img :src="event.details.cover_source">
    <div class="play"></div>

    <!-- Date + Title -->
    <div class="col headline">
      <div class="date-start">
        {{ [event.details.start_time[0], 'YYYY-MM-DD HH:mm:ss'] | moment('dddd DD MMM') }}
        {{ [event.details.start_time[0], 'YYYY-MM-DD HH:mm:ss'] | moment(' [de] HH:mm') }}
        - {{ [event.details.end_time[0], 'YYYY-MM-DD HH:mm:ss'] | moment('HH:mm') }}
      </div>
      <div class="title" v-html="event.title.rendered"></div>
    </div>

    <!-- Calls to action -->
    <div class="callsToAction">
      <!-- Share -->
      <div class="share disabled">
        <i class="material-icons">share</i>
        <span>Partager</span>
      </div>
      <!-- Star -->
      <div class="star disabled">
        <i class="material-icons">star_border</i>
        <span>Interessé(e)</span>
      </div>
      <!-- Location -->
      <div v-if="venue.acf.address" class="address">
        <i class="material-icons">place</i>
        <span>{{ venue.acf.address }}</span>
        <a :href="'http://maps.google.com/?q=' + venue.acf.address">
          <div class="map"></div>
        </a>
      </div>
      <!-- Tickets -->
      <a v-if="event.acf.billetterie_url" class="tickets" :href="event.acf.billetterie_url">
        <i class="material-icons">credit_card</i>
        <span>Billetterie</span>
      </a>
      <div v-else class="tickets disabled">
        <i class="material-icons">credit_card</i>
        <span>Billetterie</span>
      </div>
      <!-- Guestlist -->
      <a v-if="event.acf.guestlist_url" class="guestlist" :href="event.acf.guestlist_url">
        <i class="material-icons">assignment</i>
        <span>Guestlist</span>
      </a>
      <div v-else class="guestlist disabled">
        <i class="material-icons">assignment</i>
        <span>Guestlist</span>
      </div>
    </div>

    <!-- NAME -->
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'event',
  data() {
    return {
      event: '',
      venue: '',
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
        this.getVenue();
      });
    },
    getVenue() {
      axios.get(`https://pierrelange.com/wp-json/haru/v1/venues/${this.event.acf.venue[0].ID}`)
      .then((response) => {
        this.venue = response.data;
        // console.log(this.venue);
      });
    },
  },
};
</script>

<style scoped lang="stylus" src="./Event.styl"></style>
