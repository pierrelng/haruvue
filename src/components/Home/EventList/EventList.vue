<template>
  <div>
    <ul class="list"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="infiniteScrollDisabled"
        infinite-scroll-distance="100"
        infinite-scroll-immediate-check="false">
      <li v-for="event in events">
        <div class="cover">
          <!-- <a v-bind:href="event.acf.facebook_event_url"> -->
            <img v-bind:src="event.details.cover_source">
          <!-- </a> -->
          <youtube-iframe class="play"
            v-if="event.acf.youtube_music_url"
            :url="event.acf.youtube_music_url"
            v-on:implaying="updateWhosPlaying"
            ref="youtubeIframe">
          </youtube-iframe>
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
          <tags :event="event"></tags>
          <div v-if="event.acf.why_go" class="coupdecoeur">
            <span class="heartIcon"></span>
            <span class="reasonWhy"><span>On kiffe :</span> {{ event.acf.why_go }}</span>
          </div>
          <a :href="'/#/event/' + event.id">Voir plus</a>
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
import Tags from '@/components/Home/EventList/Tags/Tags';

export default {
  name: 'eventList',
  components: {
    'youtube-iframe': YoutubeIframe,
    tags: Tags,
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
      idCurrentlyPlaying: '',
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
        axios.get(`https://hosting.haruapp.fr/wp-json/haru/v1/events?offset=0&selected_day=${this.selectedDay}`)
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
        axios.get(`https://hosting.haruapp.fr/wp-json/haru/v1/events?offset=${this.offset}&selected_day=${this.selectedDay}`)
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
    // convertTimeToseconds(timeString) {
    //   const timeProps = [];
    //   if (timeString.indexOf('h') > 0) {
    //     timeProps.push('h');
    //   }
    //   if (timeString.indexOf('m') > 0) {
    //     timeProps.push('m');
    //   }
    //   if (timeString.indexOf('s') > 0) {
    //     timeProps.push('s');
    //   }
    //   let seconds = 0;
    //   let startIndex = 0;
    //   timeProps.forEach((el) => {
    //     switch (el) {
    //       case 'h': {
    //         const hours = parseInt(timeString.substring(startIndex, timeString.indexOf(el)), 10);
    //         seconds += hours * 3600;
    //         startIndex = timeString.indexOf(el) + 1;
    //         break;
    //       }
    //       case 'm': {
    //         const minutes = parseInt(timeString.substring(startIndex, timeString.indexOf(el)), 10);
    //         seconds += minutes * 60;
    //         startIndex = timeString.indexOf(el) + 1;
    //         break;
    //       }
    //       case 's':
    //         seconds += parseInt(timeString.substring(startIndex, timeString.indexOf(el)), 10);
    //         startIndex = timeString.indexOf(el) + 1;
    //         break;
    //       default:
    //         seconds = false;
    //     }
    //   });
    //   return seconds;
    // },
    updateWhosPlaying(videoId) {
      if (this.idCurrentlyPlaying === '') {
        this.$refs.youtubeIframe.forEach((el, i) => {
          if (el.videoId === videoId) {
            this.idCurrentlyPlaying = i;
          }
        });
      } else if (videoId !== 'nobody') {
        this.$refs.youtubeIframe[this.idCurrentlyPlaying].player.stopVideo();
        this.$refs.youtubeIframe.forEach((el, i) => {
          if (el.videoId === videoId) {
            this.idCurrentlyPlaying = i;
          }
        });
      } else {
        // nobody's playing
        this.idCurrentlyPlaying = '';
      }
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
