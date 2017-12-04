<template>
  <div class="bottom-nav">
    <youtube
      :video-id="videoInfo.id"
      ref="youtube"
      :height="'0'"
      :width="'0'"
      :player-vars="playerVars"
      @cued="playPause"
      @buffering="buffering"
      @playing="playing"
      @paused="paused">
    </youtube>
    <div class="playPause">
      <i class="material-icons icon" v-show="!showSpinner" @click="playPause">{{ buttonIcon }}</i>
      <mt-spinner class="spinner" v-show="showSpinner" type="fading-circle" :size="24" color="#EEEEEE"></mt-spinner>
    </div>
  </div>
</template>

<script>
import bus from '@/main';
import urlParser from 'js-video-url-parser';

export default {
  name: 'bottomNav',
  data() {
    return {
      playerVars: {
        autoplay: 0,
        controls: 0,
        origin: '',
        playsinline: 1,
        rel: 0,
        showinfo: 0,
        modestbranding: 1,
        iv_load_policy: 3,
      },
      videoInfo: {
        id: '',
      },
      showSpinner: false,
      isPlaying: false,
      buttonIcon: 'power_settings_new',
      indexPlaying: 'none',
    };
  },
  created() {
    bus.$on('bottomPlay', (data) => {
      this.videoInfo = urlParser.parse(data.youtubeUrl);
      this.indexPlaying = data.index;
      this.playPause();
    });
  },
  methods: {
    playPause() {
      if (this.isPlaying) {
        this.player.pauseVideo();
        this.buttonIcon = 'play_arrow';
      } else {
        this.player.playVideo();
        this.showSpinner = false;
      }
    },
    buffering() {
      this.showSpinner = true;
    },
    playing() {
      this.isPlaying = true;
      this.buttonIcon = 'pause';
      this.showSpinner = false;
    },
    paused() {
      this.isPlaying = false;
      this.buttonIcon = 'play_arrow';
    },
  },
  computed: {
    player() {
      return this.$refs.youtube.player;
    },
  },
  watch: {
    buttonIcon() {
      bus.$emit('updatePlayPauseButton', { buttonIcon: this.buttonIcon, indexPlaying: this.indexPlaying });
    },
    showSpinner() {
      bus.$emit('showSpinner', this.showSpinner);
    },
  },
};
</script>

<style lang="stylus" src="./BottomNav.styl"></style>
