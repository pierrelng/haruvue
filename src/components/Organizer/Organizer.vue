<template>
  <div>
    <div class="toCome">
      <span>Coming soon</span>
    </div>
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
      organizer: '',
      isTruncated: false,
      canBeTruncated: false,
    };
  },
  created() {
  },
  updated() {
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
};
</script>

<style scoped lang="stylus" src="./Organizer.styl"></style>
