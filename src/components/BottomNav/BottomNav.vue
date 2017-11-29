<template>
  <div class="bottom-nav">
    <youtube
      :video-id="videoInfo.id"
      ref="youtube"
      :height="'0'"
      :width="'0'"
      @cued="cued"
      @buffering="buffering"
      @playing="playing">
    </youtube>
    <mt-spinner v-show="showSpinner" type="fading-circle" :size="20" color="#4F4F4F"></mt-spinner>
  </div>
</template>

<script>
import bus from '@/main';
import urlParser from 'js-video-url-parser';

export default {
  name: 'bottomNav',
  data() {
    return {
      videoInfo: {
        id: '',
      },
      showSpinner: false,
    };
  },
  created() {
    bus.$on('bottomPlay', (youtubeUrl) => {
      this.videoInfo = urlParser.parse(youtubeUrl);
    });
  },
  methods: {
    cued() {
      this.player.playVideo();
      this.showSpinner = false;
    },
    buffering() {
      this.showSpinner = true;
    },
    playing() {
      this.showSpinner = false;
    },
  },
  computed: {
    player() {
      return this.$refs.youtube.player;
    },
  },
};
</script>

<style lang="stylus" src="./BottomNav.styl"></style>
