<template lang="html">
  <div class="player-youtube">
    <div class="container">
      <youtube
      :video-id="videoId"
      ref="youtube"
      :player-vars="playerVars"
      :height="'1'"
      :width="'1'"
      @playing="playing"
      @paused="paused"
      @buffering="buffering"
      @cued="cued"
      @unstarted="unstarted"
      @ready="ready">
    </youtube>
    </div>
    <i v-show="showIcon" class="material-icons" @click="playVideo">{{ buttonIcon }}</i>
    <mt-spinner v-show="showSpinner" type="fading-circle" :size="20" color="#4F4F4F"></mt-spinner>
  </div>
</template>

<script>
import getYouTubeID from 'get-youtube-id';

export default {
  name: 'youtube-iframe',
  props: ['url'],
  data() {
    return {
      playerVars: {
        controls: 0,
        // origin: ''
        playsinline: 1,
        rel: 0,
        showinfo: 0,
        modestbranding: 1,
        iv_load_policy: 3,
      },
      state: '',
      buttonIcon: 'power_settings_new',
      showSpinner: true,
      videoId: '',
      suggestedQuality: 'small',
    };
  },
  created() {
    this.getVideoId();
  },
  methods: {
    getVideoId() {
      this.videoId = getYouTubeID(this.url);
    },
    playVideo() {
      console.log('button pressed');
      if (this.state === '' || this.state === 'paused') {
        this.player.playVideo();
        this.$emit('implaying', this.videoId);
      } else {
        this.player.pauseVideo();
        this.$emit('implaying', 'nobody');
      }
    },
    playing() {
      this.state = 'playing';
      this.showSpinner = false;
      this.buttonIcon = 'pause';
    },
    paused() {
      this.state = 'paused';
      this.showSpinner = false;
      this.buttonIcon = 'play_arrow';
    },
    buffering() {
      this.showSpinner = true;
    },
    ready() {
      this.showSpinner = false;
      this.buttonIcon = 'play_arrow';
    },
    cued() {
      this.showSpinner = false;
      this.buttonIcon = 'play_arrow';
    },
    unstarted() {
      this.buttonIcon = 'power_settings_new';
    },
  },
  computed: {
    player() {
      return this.$refs.youtube.player;
    },
    showIcon() {
      return !this.showSpinner;
    },
  },
};
</script>

<style scoped lang="stylus" src="./Youtube.styl"></style>
