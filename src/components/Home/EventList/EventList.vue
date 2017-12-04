<template>
  <div>
    <ul class="list"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="infiniteScrollDisabled"
        infinite-scroll-distance="100"
        infinite-scroll-immediate-check="false">
      <!-- <li v-for="event in events" v-if="isConcert(event.acf.tag_what_prod)"> -->
      <li v-for="(event, index) in events">
        <div class="cover">
          <a :href="'/#/event/' + event.id">
            <img v-bind:src="event.details.cover_source">
          </a>
          <div class="play" v-if="event.acf.youtube_music_url" @click="bottomPlay(event.acf.youtube_music_url, index)">
            <i :id="index" class="material-icons icon" v-show="!showMusicSpinner" ref="feedCardPlayButton">{{ buttonIcon }}</i>
            <mt-spinner v-show="showMusicSpinner" type="fading-circle" :size="20" color="#4F4F4F"></mt-spinner>
          </div>
        </div>
        <a class="infos" :href="'/#/event/' + event.id">
          <span class="title" v-html="event.title.rendered"></span>
          <span class="date">
            <i class="material-icons">schedule</i>
            <span class="date-start">{{ [event.details.start_time[0], 'YYYY-MM-DD HH:mm:ss'] | moment('dddd DD MMM') }}</span>
            {{ [event.details.start_time[0], 'YYYY-MM-DD HH:mm:ss'] | moment(' [de] HH:mm') }}
            - {{ [event.details.end_time[0], 'YYYY-MM-DD HH:mm:ss'] | moment('HH:mm') }}
          </span>
          <span class="venue" v-if="event.acf.venue[0].post_title"><i class="material-icons">place</i> {{ event.acf.venue[0].post_title }}</span>
        </a>
        <div class="tagsAndReason">
          <tags :event="event"></tags>
          <div v-if="event.acf.why_go" class="coupdecoeur">
            <span class="heartIcon"></span>
            <span class="reasonWhy"><span>On kiffe :</span> {{ event.acf.why_go }}</span>
          </div>
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
import bus from '@/main';
import YoutubeIframe from '@/components/Home/EventList/Youtube/Youtube';
import Tags from '@/components/Home/EventList/Tags/Tags';

export default {
  name: 'eventList',
  components: {
    'youtube-iframe': YoutubeIframe,
    tags: Tags,
  },
  data() {
    return {
      events: [],
      noEventsFound: false,
      offset: 0,
      infiniteScrollDisabled: false,
      selectedDay: '',
      searched_tag: '',
      showSpinner: false,
      showMusicSpinner: false,
      buttonIcon: 'power_settings_new',
      indexPlaying: 'none',
    };
  },
  created() {
    if (this.$route.query.tag) {
      this.searched_tag = this.$route.query.tag;
    }
    this.getEvents();
    bus.$on('datePicked', (data) => {
      this.selectedDay = data;
    });
    bus.$on('search', (data) => {
      this.searched_tag = data;
    });
    bus.$on('updatePlayPauseButton', (data) => {
      this.$refs.feedCardPlayButton.forEach((el, i) => {
        if (el.id === data.indexPlaying.toString()) {
          this.$refs.feedCardPlayButton[i].innerHTML = data.buttonIcon;
        }
      });
    });
    bus.$on('showSpinner', (data) => {
      this.showMusicSpinner = data;
    });
  },
  methods: {
    getEvents() {
      this.events = [];
      this.showSpinner = true;
      this.noEventsFound = false;
      setTimeout(() => {
        // eslint-disable-next-line
        axios.get(`https://hosting.haruapp.fr/wp-json/haru/v1/events?offset=0&selected_day=${this.selectedDay}&searched_tag=${this.searched_tag}`)
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
        axios.get(`https://hosting.haruapp.fr/wp-json/haru/v1/events?offset=${this.offset}&selected_day=${this.selectedDay}&searched_tag=${this.searched_tag}`)
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
    bottomPlay(youtubeUrl, index) {
      if (this.indexPlaying !== 'none') {
        this.$refs.feedCardPlayButton.forEach((el, i) => {
          if (el.id === this.indexPlaying.toString()) {
            this.$refs.feedCardPlayButton[i].innerHTML = 'power_settings_new';
          }
        });
      }
      this.indexPlaying = index;
      bus.$emit('bottomPlay', { youtubeUrl, index });
    },
    // isConcert(tagArray) {
    //   let concert = false;
    //   tagArray.forEach((tag) => {
    //     if (tag === 'concert') {
    //       concert = true;
    //     }
    //   });
    //   if (concert) {
    //     return false;
    //   }
    //   return true;
    // },
  },
  watch: {
    selectedDay() {
      this.infiniteScrollDisabled = false;
      this.getEvents();
    },
    searched_tag() {
      this.infiniteScrollDisabled = false;
      this.getEvents();
    },
  },
};
</script>

<style scoped lang="stylus" src="./EventList.styl"></style>
