<template>
  <div class="bottom-player" :class="{ showBottomBar: displayBottomBar }">
    <youtube
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
    </youtube>
    <div class="playPause">
      <i class="material-icons icon" v-show="!showSpinner" @click="playPauseSimple" role="button">{{ buttonIcon }}</i>
      <mt-spinner class="spinner" v-show="showSpinner" type="fading-circle" :size="24" color="#EEEEEE"></mt-spinner>
    </div>
    <i class="material-icons rewind" @click="rewind" role="button">replay_30</i>
    <i class="material-icons fastForward" @click="fastForward" role="button">forward_30</i>
    <router-link v-if="eventPlaying.id" class="eventName" :to="{ name: 'Event', params: { id: eventPlaying.id }}" v-html="eventPlaying.name"></router-link>
  </div>
</template>

<script>
import bus from '@/main';
import urlParser from 'js-video-url-parser'; // https://github.com/Zod-/jsVideoUrlParser

export default {
  name: 'bottomPlayer',
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
      eventPlaying: {
        id: '',
        name: '',
      },
      displayBottomBar: false,
    };
  },
  created() {
    bus.$on('bottomPlay', (data) => {
      this.displayBottomBar = true;
      this.videoInfo = urlParser.parse(data.youtubeUrl);
      this.indexPlaying = data.index;
      this.playPause();
      this.eventPlaying.id = data.eventId;
      this.eventPlaying.name = data.eventName;
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
      console.log('ready');
      this.showSpinner = false;
      this.buttonIcon = 'play_arrow';
    },
    unstarted() {
      console.log('unstarted');
    },
    cued() {
      console.log('cued');
      this.showSpinner = false;
      this.buttonIcon = 'play_arrow';
    },
    buffering() {
      console.log('buffering');
      this.showSpinner = true;
    },
    playing() {
      console.log('playing');
      this.isPlaying = true;
      this.showSpinner = false;
      this.buttonIcon = 'pause';
    },
    paused() {
      console.log('paused');
      this.isPlaying = false;
      this.showSpinner = false;
      this.buttonIcon = 'play_arrow';
    },
    fastForward() {
      this.player.getCurrentTime().then((currentSeconds) => {
        this.player.seekTo(currentSeconds + 30, true);
      });
    },
    rewind() {
      this.player.getCurrentTime().then((currentSeconds) => {
        this.player.seekTo(currentSeconds - 30, true);
      });
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

<style lang="stylus" src="./BottomPlayer.styl"></style>
