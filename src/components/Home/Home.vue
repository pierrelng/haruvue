<template>
  <div>
    <!-- Search bar -->
    <form class="form" action="#" method="POST">
      <input class="form__input" type="search" name="main_search" value="" placeholder="chill, house, gratuit...">
      <input class="form__submit" type="submit" value="">
    </form>

    <!-- Date picker -->
    <ul class="datepicker scroll-x-wrapper">
      <li class="datepicker__all scroll-x-item" v-on:click="updateDay('all')">
        <svg viewBox="0 0 200 200" style="width: 25px; height: 25px">
          <path fill="none" stroke="#FFFFFF" stroke-width="7" d="M100,100 C200,0 200,200 100,100 C0,0 0,200 100,100z" />
        </svg>
      </li>
      <li class="scroll-x-item" v-on:click="updateDay('today')">Auj.</li>
      <li class="scroll-x-item" v-on:click="updateDay('tomorrow')">Dem.</li>
      <li class="scroll-x-item" v-for="(day, index) in days" v-bind:id="index" v-on:click="updateDay('temp')">{{ [day, 'DD'] | moment('dddd') }}</li>
      <li class="scroll-x-item" v-on:click="updateDay">Semaine suivante</li>
    </ul>

    <event-list v-bind:update-list="selectedDay"></event-list>

  </div>
</template>

<script>
import moment from 'moment';
import EventList from '@/components/Home/EventList/EventList';

export default {
  name: 'home',
  components: {
    'event-list': EventList,
  },
  data() {
    return {
      now: '',
      days: [],
      selectedDay: '',
    };
  },
  created() {
    // setInterval(this.getNow, 1000);
    this.setDays();
  },
  methods: {
    getNow() {
      this.now = moment().format('MMMM DD YYYY, h:mm:ss a');
    },
    setDays() {
      const sunday = moment().endOf('week');
      const daysUntilSunday = sunday.diff(moment(), 'days');
      if (daysUntilSunday > 1) {
        for (let i = 2; i <= daysUntilSunday; i += 1) {
          this.days.push(moment().add(i, 'days').format('DD'));
        }
      } else {
        const endOfNextWeek = moment().endOf('week').add(7, 'days');
        const daysUntilEndOfNextWeek = endOfNextWeek.diff(moment(), 'days');
        for (let i = 2; i <= daysUntilEndOfNextWeek; i += 1) {
          this.days.push(moment().add(i, 'days').format('DD'));
        }
      }
      // console.log(this.days);
    },
    updateDay(str) {
      if (str === 'all') {
        this.selectedDay = '';
      } else if (str === 'today') {
        this.selectedDay = moment().format('DD'); // quid quand une semaine est à cheval sur 2 mois ?
      } else if (str === 'tomorrow') {
        this.selectedDay = moment().add(1, 'days').format('DD');
      } else if (str === 'temp') {
        this.selectedDay = this.days[event.target.id];
      }
      // this.selectedDay = event.target.id;
      // console.log(this.selectedDay);
    },
  },
};
</script>

<style scoped lang="stylus" src="./Home.styl"></style>
