<template>
  <div class="bottom-nav">
    <!-- <div id="player"></div> -->
    <gajus
      :video-id="videoInfo.id"
      ref="youtube"
      :height="'0'"
      :width="'0'"
      :player-vars="playerVars"
      @ready="ready"
      @unstarted="unstarted"
      @cued="playPause"
      @buffering="buffering"
      @playing="playing"
      @paused="paused">
    </gajus>
    <div class="playPause">
      <i class="material-icons icon" v-show="!showSpinner" @click="playPauseSimple">{{ buttonIcon }}</i>
      <mt-spinner class="spinner" v-show="showSpinner" type="fading-circle" :size="24" color="#EEEEEE"></mt-spinner>
    </div>
  </div>
</template>

<script>
import bus from '@/main';
import urlParser from 'js-video-url-parser'; // https://github.com/Zod-/jsVideoUrlParser
import Gajus from '@/components/BottomNav/Gajus';

export default {
  name: 'bottomNav',
  components: {
    gajus: Gajus,
  },
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
        params: {
          start: 0,
        },
      },
      showSpinner: false,
      isPlaying: false,
      buttonIcon: '',
      indexPlaying: 'none',
      // player: '',
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
        if (this.videoInfo.params) {
          this.player.seekTo(this.videoInfo.params.start);
          this.player.playVideo();
        } else {
          this.player.playVideo();
        }
        this.showSpinner = false;
      }
    },
    playPauseSimple() {
      if (this.isPlaying) {
        this.player.pauseVideo();
        this.buttonIcon = 'play_arrow';
      } else {
        this.player.playVideo();
        this.showSpinner = false;
      }
    },
    ready() {
      // console.log('ready');
      this.showSpinner = false;
      this.buttonIcon = 'play_arrow';
    },
    unstarted() {
      // console.log('unstarted');
    },
    cued() {
      // console.log('cued');
      this.showSpinner = false;
      this.buttonIcon = 'play_arrow';
    },
    buffering() {
      // console.log('buffering');
      this.showSpinner = true;
    },
    playing() {
      // console.log('playing');
      this.isPlaying = true;
      this.showSpinner = false;
      this.buttonIcon = 'pause';
    },
    paused() {
      // console.log('paused');
      this.isPlaying = false;
      this.showSpinner = false;
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
