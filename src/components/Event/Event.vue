<template>
  <div>
    <!-- Img with player -->
    <div class="head">
      <img v-if="event" :src="event.details.cover_source">
      <youtube-iframe class="play" v-if="event.acf.youtube_music_url" :url="event.acf.youtube_music_url"></youtube-iframe>
    </div>

    <!-- Date + Title -->
    <div v-if="event" class="col headline">
      <div class="date-start">
        {{ [event.details.start_time[0], 'YYYY-MM-DD HH:mm:ss'] | moment('dddd DD MMM') }}
        {{ [event.details.start_time[0], 'YYYY-MM-DD HH:mm:ss'] | moment(' [de] HH:mm') }}
        - {{ [event.details.end_time[0], 'YYYY-MM-DD HH:mm:ss'] | moment('HH:mm') }}
      </div>
      <div class="title" v-html="event.title.rendered"></div>
    </div>

    <!-- Calls to action -->
    <div v-if="event" class="callsToAction">
      <div class="row1">
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
      </div>
      <!-- Location -->
      <div v-if="venue && venue.acf.address" class="location">
        <i class="material-icons">place</i>
        <span>{{ venue.acf.address }}</span>
        <a :href="'http://maps.google.com/?q=' + venue.acf.address">
          <div class="map"></div>
        </a>
      </div>
      <div v-else class="location">
        <i class="material-icons">place</i>
        <span>{{ free_address }}</span>
        <a :href="'http://maps.google.com/?q=' + free_address">
          <div class="map"></div>
        </a>
      </div>
      <!-- Tickets -->
      <div class="row3">
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
    </div>

    <!-- Venue -->
    <div v-if="venue && event.acf.venue[0].ID" class="col wrapper venue">
      <span class="rubric">Lieu de l'event</span>
      <router-link class="tile blue" :to="{ name: 'Venue', params: { id: event.acf.venue[0].ID }}">
        <img class="venueLogo" :src="venue.acf.logo.url" height="40" width="40">
        <div class="container">
          <span class="name" v-html="venue.title.rendered"></span>
          <ul class="type">
            <li v-for="type in venue.acf.type"><span class="bullet"></span>{{ type }}</li>
          </ul>
        </div>
      </router-link>
    </div>

    <!-- Organizer -->
    <div v-if="organizer && event.acf.organizer[0].ID" class="col wrapper organizer">
      <span class="rubric">Organisateur de l'event</span>
      <router-link class="tile red" :to="{ name: 'Organizer', params: { id: event.acf.organizer[0].ID }}">
        <img class="organizerLogo" :src="organizer.acf.logo.url" height="40" width="40">
        <div class="container">
          <span class="name" v-html="organizer.title.rendered"></span>
          <ul class="type">
            <li v-for="type in organizer.acf.type"><span class="bullet"></span>{{ type }}</li>
          </ul>
        </div>
      </router-link>
    </div>

    <!-- Description -->
    <div v-if="event" class="col wrapper description">
      <span class="rubric">Description</span>
      <div class="separator"></div>
      <div ref="descriptionContent" class="content" :class="{ truncated: isTruncated }" @click="toggleDescription">
        <div v-html="event.acf.description"></div>
        <div :class="{ shadow: isTruncated }"></div>
      </div>
    </div>

    <!-- Tags -->
    <div v-if="event" class="col wrapper tags">
      <div v-if="event.acf.why_go" class="coupdecoeur">
        <span class="rubric">On kiffe</span>
        <span class="reasonWhy">{{ event.acf.why_go }}</span>
      </div>
      <span class="rubric">Genre</span>
      <ul>
        <li v-for="tag in event.acf.tag_what_genre">{{ tag }}</li>
      </ul>
      <span v-if="event.acf.tag_what_prod" class="rubric">Type</span>
      <ul>
        <li v-for="tag in event.acf.tag_what_prod">{{ tag }}</li>
      </ul>
      <span class="rubric">Divers</span>
      <ul>
        <li v-for="tag in event.acf.tag_what_atmos_scale">{{ tag }}</li>
        <li v-for="tag in event.acf.tag_what_activities">{{ tag }}</li>
        <li v-for="tag in event.acf.tag_what_atmos_misc">{{ tag }}</li>
      </ul>
      <span v-if="event.acf.tag_how_price" class="rubric">Prix</span>
      <ul>
        <li v-for="tag in event.acf.tag_how_price">{{ tag }}</li>
      </ul>
    </div>

    <!-- Links -->
    <div v-if="event" class="col wrapper links">
      <span class="rubric">Liens</span>
      <a :href="event.acf.facebook_event_url"></a>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import YoutubeIframe from '@/components/Home/EventList/Youtube/Youtube';

export default {
  name: 'event',
  components: {
    'youtube-iframe': YoutubeIframe,
  },
  data() {
    return {
      event: '',
      venue: '',
      organizer: '',
      isTruncated: false,
      canBeTruncated: false,
    };
  },
  created() {
    this.getEvent();
  },
  updated() {
    this.decideTruncate();
  },
  methods: {
    getEvent() {
      axios.get(`https://hosting.haruapp.fr/wp-json/haru/v1/events/${this.$route.params.id}`)
      .then((response) => {
        this.event = response.data;
        if (this.event.acf.venue[0].ID) {
          this.getVenue();
        }
        if (this.event.acf.organizer[0].ID) {
          this.getOrganizer();
        }
      });
    },
    getVenue() {
      axios.get(`https://hosting.haruapp.fr/wp-json/haru/v1/venues/${this.event.acf.venue[0].ID}`)
      .then((response) => {
        this.venue = response.data;
      });
    },
    getOrganizer() {
      axios.get(`https://hosting.haruapp.fr/wp-json/haru/v1/organizers/${this.event.acf.organizer[0].ID}`)
      .then((response) => {
        this.organizer = response.data;
      });
    },
    toggleDescription() {
      if (this.canBeTruncated === true) {
        this.isTruncated = !this.isTruncated;
      }
    },
    decideTruncate() {
      if (this.$refs.descriptionContent.clientHeight > 180 && this.canBeTruncated === false) {
        this.canBeTruncated = true;
        this.isTruncated = true;
      }
    },
  },
  computed: {
    free_address() {
      // eslint-disable-next-line
      return `${this.event.acf.free_address_street}, ${this.event.acf.free_address_postcode} ${this.event.acf.free_address_city}`;
    },
  },
};
</script>

<style scoped lang="stylus" src="./Event.styl"></style>
