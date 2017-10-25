<template>
  <div>
    <ul class="list"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="infiniteScrollDisabled"
        infinite-scroll-distance="100"
        infinite-scroll-immediate-check="false">
      <li v-for="event in events">
        <div class="cover">
          <a v-bind:href="event.acf.facebook_event_url">
            <img v-bind:src="event.details.cover_source">
          </a>
          <div class="play" v-if="event.acf.youtube_music_url" @click="playPause(videoId(event.acf.youtube_music_url))">
            <youtube-iframe
              v-bind:video-id="videoId(event.acf.youtube_music_url)"
              ref="youtube"
              v-on:playing="showPause"
              v-on:paused="showPlay"
              v-on:buffering="showBuffer">
            </youtube-iframe>
            <span class="player-symbol">play</span>
          </div>
        </div>
        <div class="infos">
          <span class="title" v-html="event.title.rendered"></span>
          <span class="date">
            <i class="material-icons">schedule</i>
            <span class="date-start">{{ [event.details.start_time[0], 'YYYY-MM-DD HH:mm:ss'] | moment('dddd DD MMM') }}</span>
            {{ [event.details.start_time[0], 'YYYY-MM-DD HH:mm:ss'] | moment(' [de] HH:mm') }}
            - {{ [event.details.end_time[0], 'YYYY-MM-DD HH:mm:ss'] | moment('HH:mm') }}
          </span>
          <span class="venue" v-if="event.acf.venue[0].post_title"><i class="material-icons">place</i> {{ event.acf.venue[0].post_title }}</span>
        </div>
      </li>
    </ul>
    <p v-show="showSpinner" class="spinner">
      <mt-spinner type="triple-bounce"></mt-spinner>
    </p>
    <p v-show="noEventsFound" style="text-align: center;">Fin de la liste</p>
  </div>
</template>

<script>
import axios from 'axios';
import YoutubeIframe from '@/components/Home/EventList/Youtube/Youtube';

export default {
  name: 'eventList',
  components: {
    'youtube-iframe': YoutubeIframe,
  },
  props: ['selectedDay'],
  data() {
    return {
      events: [],
      noEventsFound: false,
      offset: 0,
      infiniteScrollDisabled: false,
      showSpinner: false,
      playing: {},
    };
  },
  created() {
    this.getEvents();
  },
  methods: {
    getEvents() {
      this.events = [];
      this.showSpinner = true;
      this.noEventsFound = false;
      setTimeout(() => {
        axios.get(`https://pierrelange.com/wp-json/haru/v1/events?offset=0&selected_day=${this.selectedDay}`)
        .then((response) => {
          this.noEventsFound = false;
          this.events = response.data;
          this.showSpinner = false;
        })
        .catch(() => {
          this.showSpinner = false;
          this.noEventsFound = true;
        });
      }, 5);
    },
    loadMore() {
      this.infiniteScrollDisabled = true;
      this.showSpinner = true;
      setTimeout(() => {
        this.offset = this.events.length;
        // eslint-disable-next-line
        axios.get(`https://pierrelange.com/wp-json/haru/v1/events?offset=${this.offset}&selected_day=${this.selectedDay}`)
        .then((response) => {
          this.noEventsFound = false;
          response.data.forEach((event) => {
            this.events.push(event);
          });
          this.showSpinner = false;
          this.infiniteScrollDisabled = false;
        })
        .catch(() => {
          this.showSpinner = false;
          this.noEventsFound = true;
          this.offset = 0;
        });
      }, 5);
    },
    playPause(targetVideoId) {
      if (this.playing.state === 'playing') {
        if (this.playing.videoId === targetVideoId) {
          this.player.pauseVideo();
        } else {
          this.player.pauseVideo();
          this.$refs.youtube.forEach((el, i) => {
            if (el.videoId === targetVideoId) {
              this.player = this.$refs.youtube[i].player;
              this.player.playVideo();
            }
          });
        }
      } else {
        this.$refs.youtube.forEach((el, i) => {
          if (el.videoId === targetVideoId) {
            this.player = this.$refs.youtube[i].player;
            this.player.playVideo();
          }
        });
      }
    },
    convertTimeToseconds(timeString) {
      const timeProps = [];
      if (timeString.indexOf('h') > 0) {
        timeProps.push('h');
      }
      if (timeString.indexOf('m') > 0) {
        timeProps.push('m');
      }
      if (timeString.indexOf('s') > 0) {
        timeProps.push('s');
      }
      let seconds = 0;
      let startIndex = 0;
      timeProps.forEach((el) => {
        switch (el) {
          case 'h': {
            const hours = parseInt(timeString.substring(startIndex, timeString.indexOf(el)), 10);
            seconds += hours * 3600;
            startIndex = timeString.indexOf(el) + 1;
            break;
          }
          case 'm': {
            const minutes = parseInt(timeString.substring(startIndex, timeString.indexOf(el)), 10);
            seconds += minutes * 60;
            startIndex = timeString.indexOf(el) + 1;
            break;
          }
          case 's':
            seconds += parseInt(timeString.substring(startIndex, timeString.indexOf(el)), 10);
            startIndex = timeString.indexOf(el) + 1;
            break;
          default:
            seconds = false;
        }
      });
      return seconds;
    },
    videoId(url) {
      const currentVideoIdArr = url.match(/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/);
      const currentVideoId = currentVideoIdArr[1];
      return currentVideoId;
    },
    showPause(e) {
      e.a.parentElement.nextElementSibling.innerText = 'pause';
      this.playing.state = 'playing';
      this.playing.videoId = e.b.c.videoId;
    },
    showPlay(e) {
      e.a.parentElement.nextElementSibling.innerText = 'play';
      this.playing.state = 'paused';
    },
    showBuffer(e) {
      e.a.parentElement.nextElementSibling.innerText = 'buffering';
    },
  },
  watch: {
    selectedDay() {
      this.infiniteScrollDisabled = false;
      this.getEvents();
    },
  },
};
</script>

<style scoped lang="stylus" src="./EventList.styl"></style>
