<template>
  <div
    class="playButtonnn"
    @click="togglePlayPause()"
    :ref="ref">
    <i class="material-icons icon" :class="{ clickMe: clickMeAnimation }" v-show="!showSpinner" role="button">{{ icon }}</i>
    <mt-spinner v-show="showSpinner" type="fading-circle" :size="20" color="#4F4F4F"></mt-spinner>
  </div>
</template>

<script>
import bus from '@/main';

export default {
  props: ['musicUrl', 'eventId', 'eventName', 'linked'],
  data() {
    return {
      ref: `playButton-${this.eventId}`,
      icon: 'headset',
      showSpinner: false,
      clickMeAnimation: false,
    };
  },
  created() {
    if (this.linked) {
      this.icon = this.$store.state.activePreview.icon;
    }
    if (this.eventId === this.$store.state.activePreview.event.id) {
      this.icon = this.$store.state.activePreview.icon;
    }
    bus.$on('updatePlayPauseIcon', (payload) => {
      if (this.ref === payload.ref) {
        this.icon = payload.icon;
      } else {
        this.icon = 'headset';
      }
    });
    bus.$on('showSpinner', (payload) => {
      if (this.ref === payload.ref) {
        this.showSpinner = payload.showSpinner;
      } else {
        this.showSpinner = false;
      }
    });
    bus.$on('animatePlayPauseIcon', (payload) => {
      if (this.ref === payload.ref) {
        this.clickMeAnimation = true;
      } else {
        this.clickMeAnimation = false;
      }
    });
    bus.$on('interruptAnimation', (payload) => {
      if (this.ref === payload.ref) {
        this.clickMeAnimation = false;
      }
    });
  },
  methods: {
    togglePlayPause() {
      this.clickMeAnimation = false; // need false for when clicking on bottomPlayer play button
      bus.$emit('togglePlayPause', {
        musicUrl: this.musicUrl,
        eventId: this.eventId,
        eventName: this.eventName,
        ref: this.ref,
      });
    },
  },
};
</script>

<style scoped lang="stylus" src="./Play.styl"></style>
