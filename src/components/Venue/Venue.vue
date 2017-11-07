<template>
  <div>

    <!-- <img :src=""> -->

    <!-- Header -->
    <div v-if="venue" class="col wrapper">
      <img :src="venue.acf.logo.url">
      <div class="container">
        <span class="name" v-html="venue.title.rendered"></span>
        <ul class="type">
          <li v-for="type in venue.acf.type"><span class="bullet"></span>{{ type }}</li>
        </ul>
      </div>
    </div>

    <!-- Navigation -->
    <nav>
      <div class="infos" :class="{ active: isActive === 'infos' }" @click="show('infos')" >
        <span>Infos</span>
        <div class="line" :class="{ lineActive: isActive === 'infos' }"></div>
      </div>
      <div class="events" :class="{ active: isActive === 'events' }" @click="show('events')">
        <span>Events</span>
        <div class="line" :class="{ lineActive: isActive === 'events' }"></div>
      </div>
      <div class="photos" :class="{ active: isActive === 'photos' }" @click="show('photos')">
        <span>Photos</span>
        <div class="line" :class="{ lineActive: isActive === 'photos' }"></div>
      </div>
    </nav>

    <!-- Infos -->
    <div v-if="isActive === 'infos'" class="infos">

      <!-- Description -->
      <div v-if="venue" class="col card">
        <span class="rubric">Description</span>
        <div class="content" :class="{ truncated: isTruncated }" @click="toggleDescription">
          <div v-html="venue.acf.description"></div>
          <div :class="{ shadow: isTruncated }"></div>
        </div>
      </div>

      <!-- Location -->
      <div v-if="venue" class="col card location">
        <span class="rubric">Adresse</span>
        <div class="location_infos">
          <a :href="'http://maps.google.com/?q=' + venue.acf.address">
            <div class="map"></div>
          </a>
          <span class="address">{{ venue.acf.address }}</span>
        </div>
      </div>

      <!-- Liens -->
      <div v-if="venue" class="col card links">
        <span class="rubric">Social Media</span>
        <a v-if="venue.acf.facebook_page" class="facebook" :href="venue.acf.facebook_page"></a>
        <a v-if="venue.acf.instagram" class="instagram" :href="venue.acf.instagram"></a>
        <a v-if="venue.acf.soundcloud" class="soundcloud" :href="venue.acf.soundcloud"></a>
        <a v-if="venue.acf.twitter" class="twitter" :href="venue.acf.twitter"></a>
      </div>

    </div>

    <!-- Events -->
    <div v-if="isActive === 'events'" class="toCome">
      <span>A venir ;)</span>
    </div>

    <!-- Photos -->
    <div v-if="isActive === 'photos'" class="toCome">
      <span>A venir ;)</span>
    </div>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'venue',
  data() {
    return {
      venue: '',
      isActive: 'infos',
      isTruncated: 'true',
    };
  },
  created() {
    this.getVenue();
  },
  methods: {
    getVenue() {
      axios.get(`https://pierrelange.com/wp-json/haru/v1/venues/${this.$route.params.id}`)
      .then((response) => {
        this.venue = response.data;
      });
    },
    show(tab) {
      this.isActive = tab;
    },
    toggleDescription() {
      this.isTruncated = !this.isTruncated;
    },
  },
};
</script>

<style scoped lang="stylus" src="./Venue.styl"></style>
