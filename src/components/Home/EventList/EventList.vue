<template>
  <div>
    <ul class="list"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="infiniteScrollDisabled"
        infinite-scroll-distance="2000"
        infinite-scroll-immediate-check="false">
      <!-- <li v-for="event in events" v-if="isConcert(event.acf.tag_what_prod)"> -->
      <li v-for="(event, index) in events">
        <div v-if="event.acf.enunmot" class="enunmot" :class="getClassColor(event.acf.genre_principal)">{{ event.acf.enunmot }}</div>
        <div class="overflowww">
          <div class="cover">
            <router-link :to="{ name: 'Event', params: { id: event.id, origin: 'home' }}">
              <img v-bind:src="event.details.cover_source">
            </router-link>
            <div
              class="play"
              v-if="event.acf.youtube_music_url"
              @click="bottomPlay(event.acf.youtube_music_url, index, event.id, event.title.rendered)">
              <i :id="index" class="material-icons icon" v-show="!showMusicSpinner" ref="feedCardPlayButton" role="button">{{ buttonIcon }}</i>
              <mt-spinner v-show="showMusicSpinner" type="fading-circle" :size="20" color="#4F4F4F"></mt-spinner>
            </div>
          </div>
          <div class="infos">
            <!-- <span class="title" v-html="event.title.rendered"></span> -->
            <div class="tagsAndReason">
              <tags :event="event"></tags>
              <div v-if="event.acf.why_go" class="coupdecoeur">
                <span class="heartIcon"></span>
                <span class="reasonWhy"><span>On kiffe :</span> {{ event.acf.why_go }}</span>
              </div>
            </div>
            <span class="date">
              <i class="material-icons">schedule</i>
              <span class="date-start">{{ [event.details.start_time[0], 'YYYY-MM-DD HH:mm:ss'] | moment('dddd DD MMM') }}</span>
              {{ [event.details.start_time[0], 'YYYY-MM-DD HH:mm:ss'] | moment(' [de] HH:mm') }}
              - {{ [event.details.end_time[0], 'YYYY-MM-DD HH:mm:ss'] | moment('HH:mm') }}
            </span>
            <span class="venue" v-if="event.acf.venue && event.acf.venue[0].post_title"><i class="material-icons">place</i> {{ event.acf.venue[0].post_title }}</span>
            <span class="venue" v-else><i class="material-icons">place</i>{{ event.acf.free_address_postcode }} {{ event.acf.free_address_city }} </span>
          </div>
        </div>
      </li>
    </ul>
    <p v-show="showSpinner" class="spinner">
      <mt-spinner type="triple-bounce"></mt-spinner>
    </p>
    <p class="noEventsFound" v-show="noEventsFound">C'est tout pour aujourd'hui !</p>
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
      buttonIcon: 'queue_music',
      indexPlaying: 'none',
    };
  },
  created() {
    if (this.$route.params.tag) {
      this.searched_tag = this.$route.params.tag;
    }
    if (this.$route.query.j) {
      this.selectedDay = this.$route.query.j;
      bus.$emit('hasUrlDate', this.$route.query.j);
    }
    this.getEvents();
    bus.$on('datePicked', (data) => {
      this.selectedDay = data;
    });
    bus.$on('search', (data) => {
      this.searched_tag = data;
    });
    bus.$on('updatePlayPauseButton', (data) => {
      if (this.$refs.feedCardPlayButton) {
        this.$refs.feedCardPlayButton.forEach((el, i) => {
          if (el.id === data.indexPlaying.toString()) {
            this.$refs.feedCardPlayButton[i].innerHTML = data.buttonIcon;
          }
        });
      }
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
    bottomPlay(youtubeUrl, index, eventId, eventName) {
      if (this.indexPlaying !== 'none') {
        this.$refs.feedCardPlayButton.forEach((el, i) => {
          if (el.id === this.indexPlaying.toString()) {
            this.$refs.feedCardPlayButton[i].innerHTML = 'queue_music';
          }
        });
      }
      this.indexPlaying = index;
      bus.$emit('bottomPlay', { youtubeUrl, index, eventId, eventName });
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
    getClassColor(genre) {
      if (genre) {
        if (genre[0].search('rock') >= 0 || genre[0].search('Rock') >= 0) {
          return 'green';
        }
        if (genre[0].search('pop') >= 0 || genre[0].search('Pop') >= 0) {
          return 'pink';
        }
        if (genre[0].search('house') >= 0 || genre[0].search('House') >= 0) {
          return 'blue';
        }
        if (genre[0].search('techno') >= 0 || genre[0].search('Techno') >= 0) {
          return 'violet';
        }
        if (genre[0].search('latin') >= 0 || genre[0].search('Latin') >= 0) {
          return 'yellow';
        }
        if (genre[0].search('hiphop') >= 0 || genre[0].search('Hip') >= 0) {
          return 'orange';
        }
        if (genre[0].search('jazz') >= 0 || genre[0].search('Jazz') >= 0) {
          return 'turquoise';
        }
        if (genre[0].search('electro') >= 0 || genre[0].search('Electro') >= 0) {
          return 'red';
        }
      }
      return 'black';
    },
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
    $route(to) {
      if (to.params.tag && to.params.tag !== 'categories') {
        this.searched_tag = to.params.tag;
        bus.$emit('tagClicked', to.params.tag);
      }
      if (to.query.j) {
        this.selectedDay = to.query.j;
        bus.$emit('hasUrlDate', to.query.j);
      }
    },
  },
};
</script>

<style scoped lang="stylus" src="./EventList.styl"></style>
