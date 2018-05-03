<template>
  <div class="bottom-player" :class="{ showBottomBar: displayBottomBar }">
    <youtube
      :video-id="videoInfo.id"
      ref="youtube"
      :height="'0'"
      :width="'0'"
      :player-vars="playerVars"
      @ready="ready()"
      @unstarted="unstarted()"
      @cued="cued()"
      @buffering="buffering()"
      @playing="playing()"
      @paused="paused()">
    </youtube>
    <div class="playPause">
      <i class="material-icons icon" v-show="!showSpinner" @click="togglePlayPause(true)" role="button">{{ icon }}</i>
      <mt-spinner class="spinner" v-show="showSpinner" type="fading-circle" :size="24" color="#EEEEEE"></mt-spinner>
    </div>
    <i class="material-icons rewind" @click="rewind" role="button">replay_30</i>
    <i class="material-icons fastForward" @click="fastForward" role="button">forward_30</i>
    <router-link
      class="eventName"
      v-if="active.event.id"
      :to="{ name: 'Event', params: { id: active.event.id }}"
      v-html="active.event.name">
    </router-link>
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
        autoplay: 1,
        controls: 0,
        origin: 'https://haruapp.fr',
        playsinline: 1,
        rel: 0,
        showinfo: 0,
        modestbranding: 1,
        iv_load_policy: 3,
      },
      firstLoad: true,
      videoInfo: {
        id: '',
        params: {
          start: 0,
        },
      },
      showSpinner: false,
      isCued: false,
      isPlaying: false,
      icon: '',
      indexPlaying: 'none',
      active: {
        event: {
          id: '',
          name: '',
        },
        iconRef: '',
      },
      displayBottomBar: false,
      overrideBufferingBug: false,
    };
  },
  created() {
    bus.$on('togglePlayPause', (payload) => {
      if (this.isMobile()) {
        if (this.active.event.id === payload.eventId) {
          this.firstLoad = false;
        } else {
          console.log(`Load : ${this.videoInfo.id}`);
          this.firstLoad = true;
          this.overrideBufferingBug = true;
          console.log(`bufferBug : ${this.overrideBufferingBug}`);
        }
      }
      this.displayBottomBar = true;
      this.videoInfo = urlParser.parse(payload.musicUrl);
      this.active.event.id = payload.eventId;
      this.active.event.name = `${payload.eventName.substring(0, 35)}...`;
      this.active.iconRef = payload.ref;
      this.togglePlayPause();
    });
  },
  methods: {
    togglePlayPause(fromBottomPlayer) {
      if (fromBottomPlayer && this.isMobile()) {
        this.firstLoad = false;
        bus.$emit('interruptAnimation', { ref: this.active.iconRef });
      }
      if (this.isPlaying) {
        this.player.pauseVideo();
        this.icon = 'play_arrow';
      } else {
        this.player.playVideo();
        this.showSpinner = false;
      }
    },
    ready() {
      console.log('ready');
      this.showSpinner = false;
      this.icon = 'play_arrow';
    },
    unstarted() {
      console.log('unstarted');
    },
    cued() {
      console.log('cued');
    },
    buffering() {
      console.log('buffering');
      this.showSpinner = true;
      if (this.overrideBufferingBug && this.isMobile()) {
        this.showSpinner = false;
        this.icon = 'play_arrow';
        bus.$emit('updatePlayPauseIcon', { icon: this.icon, ref: this.active.iconRef });
        // + animate button to show readyness
        bus.$emit('animatePlayPauseIcon', { ref: this.active.iconRef });
      }
    },
    playing() {
      console.log('playing');
      if (this.firstLoad && this.isMobile()) {
        this.showSpinner = false;
        this.icon = 'play_arrow';
        bus.$emit('updatePlayPauseIcon', { icon: this.icon, ref: this.active.iconRef });
        // this.firstLoad = false;
      } else {
        this.showSpinner = false;
        this.isPlaying = true;
        this.icon = 'pause';
        console.log(this.isPlaying);
      }
    },
    paused() {
      console.log('paused');
      this.isPlaying = false;
      this.showSpinner = false;
      this.icon = 'play_arrow';
      if (this.firstLoad && this.isMobile()) {
        bus.$emit('animatePlayPauseIcon', { ref: this.active.iconRef });
      }
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
    isMobile() {
      if (navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)
      ) {
        return true;
      }
      return false;
    },
  },
  computed: {
    player() {
      return this.$refs.youtube.player;
    },
  },
  watch: {
    icon() {
      bus.$emit('updatePlayPauseIcon', { icon: this.icon, ref: this.active.iconRef });
      this.$store.commit('updateActivePreviewIcon', this.icon);
    },
    showSpinner() {
      bus.$emit('showSpinner', { showSpinner: this.showSpinner, ref: this.active.iconRef });
    },
    active: {
      handler() {
        this.$store.commit('updateActivePreviewEventId', this.active.event.id);
      },
      deep: true,
    },
  },
};
</script>

<style lang="stylus" src="./BottomPlayer.styl"></style>
