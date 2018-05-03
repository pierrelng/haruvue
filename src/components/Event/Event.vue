<template>
  <div>
    <!-- Back button -->
    <div class="backButton" @click="back()">
      <i class="material-icons arrowBack">arrow_back</i>
      <div class="">Back</div>
    </div>

    <!-- Img with player -->
    <div class="head" v-if="event">
      <img v-if="event.details.cover_source" :src="event.details.cover_source">
      <img v-else :src="event.acf.cover_image">
      <play
        v-if="event.acf.youtube_music_url"
        :music-url="event.acf.youtube_music_url"
        :event-id="event.id"
        :event-name="event.title.rendered"
        :linked="linkedBottomPlayer">
      </play>
      <!-- <div
        class="play"
        v-if="event.acf.youtube_music_url"
        @click="togglePlayPause(event.acf.youtube_music_url, event.id, event.title.rendered)">
        <i class="material-icons icon" v-show="!showMusicSpinner" role="button">{{ icon }}</i>
        <mt-spinner v-show="showMusicSpinner" type="fading-circle" :size="20" color="#4F4F4F"></mt-spinner>
      </div> -->
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
import bus from '@/main';
import Play from '@/components/Home/EventList/Play/Play';

export default {
  name: 'event',
  components: {
    play: Play,
  },
  data() {
    return {
      event: '',
      venue: '',
      organizer: '',
      isTruncated: false,
      canBeTruncated: false,
      icon: 'headset',
      showMusicSpinner: false,
      fromHome: false,
      linkedBottomPlayer: false,
    };
  },
  created() {
    this.getEvent();
    if (this.$route.params.origin === 'home') {
      this.fromHome = true;
    }
    bus.$on('showSpinner', (data) => {
      this.showMusicSpinner = data;
    });
    // bus.$on('updatePlayPauseIcon', (payload) => {
    //   if (this.linkedBottomPlayer) {
    //     this.icon = payload.icon;
    //   }
    // });
  },
  updated() {
    this.decideTruncate();
  },
  methods: {
    getEvent() {
      axios.get(`https://hosting.haruapp.fr/wp-json/haru/v1/events/${this.$route.params.id}`)
      .then((response) => {
        this.event = response.data;
        if (response.data.acf.venue[0].ID) {
          this.getVenue();
        }
        if (response.data.acf.organizer) {
          this.getOrganizer();
        }
        console.log(this.$store.state);
        if (response.data.id === this.$store.state.activePreview.event.id) {
          this.linkedBottomPlayer = true;
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
    // togglePlayPause(youtubeUrl, eventId, eventName) {
    //   bus.$emit('togglePlayPause', { youtubeUrl, eventId, eventName });
    // },
    back() {
      if (this.fromHome) {
        this.$router.go(-1);
      } else {
        this.$router.push({ name: 'Home' });
      }
    },
  },
  computed: {
    free_address() {
      // eslint-disable-next-line
      return `${this.event.acf.free_address_street}, ${this.event.acf.free_address_postcode} ${this.event.acf.free_address_city}`;
    },
    // icon() {
    //   if (this.linkedBottomPlayer) {
    //     return this.$store.state.activePreview.icon;
    //   }
    // },
  },
};
</script>

<style scoped lang="stylus" src="./Event.styl"></style>
