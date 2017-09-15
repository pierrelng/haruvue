<template lang="html">
  <div class="player-youtube">
    <div class="player-youtube-video" :id="playerId"></div>
  </div>
</template>

<script>
import uniqid from 'uniqid';
import player from 'youtube-player'; // https://github.com/gajus/youtube-player

const state = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
};

export default {
  name: 'youtube',
  props: {
    videoId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      playerId: uniqid('player-'),
      player: {},
      events: {
        [state.UNSTARTED]: 'unstarted',
        [state.PLAYING]: 'playing',
        [state.PAUSED]: 'paused',
        [state.ENDED]: 'ended',
        [state.BUFFERING]: 'buffering',
        [state.CUED]: 'cued',
      },
    };
  },
  beforeDestroy() {
    if (this.player !== null && this.player.destroy) {
      this.player.destroy();
      delete this.player;
    }
  },
  mounted() {
    this.player = player(this.playerId, {
      videoId: this.videoId,
      width: '0',
      height: '0',
      playerVars: {
        playsinline: '1',
        showinfo: '0',
        rel: '0',
        autoplay: '0',
      },
      suggestedQuality: 'small',
    });
    this.player.on('ready', this.playerReady);
    this.player.on('stateChange', this.playerStateChange);
    this.player.on('error', this.playerError);
  },
  watch: {
    videoId: 'updatePlayer',
  },
  methods: {
    playerReady(e) {
      this.$emit('ready', e.target);
    },
    playerStateChange(e) {
      if (e.data !== null && e.data !== state.UNSTARTED) {
        this.$emit(this.events[e.data], e.target);
      }
    },
    playerError(e) {
      this.$emit('error', e.target);
    },
    updatePlayer(videoId) {
      if (!videoId) {
        this.player.stopVideo();
        return;
      }
      if (this.playerVars.autoplay === 1) {
        this.player.loadVideoById({ videoId });
        return;
      }
      this.player.cueVideoById({ videoId });
    },
  },
};
</script>

<style lang="css">
</style>
