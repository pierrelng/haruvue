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
              <img v-if="event.details.cover_source" v-bind:src="event.details.cover_source">
              <img v-else v-bind:src="event.acf.cover_image">
            </router-link>
            <play
              v-if="event.acf.youtube_music_url"
              :music-url="event.acf.youtube_music_url"
              :event-id="event.id"
              :event-name="event.title.rendered">
            </play>
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
            <router-link :to="{ name: 'Event', params: { id: event.id, origin: 'home' }}">
              <span class="date">
                <i class="material-icons">schedule</i>
                <span class="date-start">{{ [event.details.start_time[0], 'YYYY-MM-DD HH:mm:ss'] | moment('dddd DD MMM') }}</span>
                {{ [event.details.start_time[0], 'YYYY-MM-DD HH:mm:ss'] | moment(' [de] HH:mm') }}
                - {{ [event.details.end_time[0], 'YYYY-MM-DD HH:mm:ss'] | moment('HH:mm') }}
              </span>
              <span class="venue" v-if="event.acf.venue && event.acf.venue[0].post_title"><i class="material-icons">place</i> {{ event.acf.venue[0].post_title }}</span>
              <span class="venue" v-else><i class="material-icons">place</i>{{ event.acf.free_address_postcode }} {{ event.acf.free_address_city }} </span>
            </router-link>
          </div>
        </div>
      </li>
    </ul>
    <p v-show="showSpinner" class="spinner">
      <mt-spinner type="triple-bounce"></mt-spinner>
    </p>
    <p class="noEventsFound" v-show="noEventsFound">C'est tout pour aujourd'hui !</p>
    <p class="noEventsFound" v-show="noEventsFound && searched_tag">Liste filtrée avec le tag "{{ searched_tag }}".</p>
    <div
      class="reset"
      v-show="noEventsFound && searched_tag"
      @click="reset()">
        Retirer le filtre
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import bus from '@/main';
import Play from '@/components/Home/EventList/Play/Play';
import Tags from '@/components/Home/EventList/Tags/Tags';
import urlParser from 'js-video-url-parser'; // https://github.com/Zod-/jsVideoUrlParser

export default {
  name: 'eventList',
  components: {
    play: Play,
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
    reset() {
      bus.$emit('clearTag');
    },
  },
  computed: {
    iframeList() {
      const list = [];
      this.events.forEach((el) => {
        if (el.acf.youtube_music_url) {
          list.push({ eventId: el.id, video: urlParser.parse(el.acf.youtube_music_url) });
        }
      });
      return list;
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
    events() {
      bus.$emit('updateIframeList', this.iframeList);
    },
  },
};
</script>

<style scoped lang="stylus" src="./EventList.styl"></style>
