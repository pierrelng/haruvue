<template>
  <div>
    <!-- Search bar -->
    <form class="form" action="#" method="POST">
      <input class="form__input" type="search" name="main_search" value="" placeholder="chill, house, gratuit...">
      <input class="form__submit" type="submit" value="">
    </form>

    <!-- Date picker -->
    <!-- <div class="wrapper"> -->
    <ul class="datepicker scroll-x-wrapper">
      <li class="datepicker__all scroll-x-item">∞</li>
      <li class="scroll-x-item">Auj.</li>
      <li class="scroll-x-item">Dem.</li>
      <li class="scroll-x-item" v-for="day in days">{{ day }}</li>
      <li class="scroll-x-item">Semaine suivante</li>
    </ul>
    <!-- </div> -->

    <event-list></event-list>

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
          this.days.push(moment().add(i, 'days').format('dddd'));
        }
      } else {
        const endOfNextWeek = moment().endOf('week').add(7, 'days');
        const daysUntilEndOfNextWeek = endOfNextWeek.diff(moment(), 'days');
        for (let i = 2; i <= daysUntilEndOfNextWeek; i += 1) {
          this.days.push(moment().add(i, 'days').format('dddd'));
        }
      }
      // console.log(this.days);
    },
  },
};
</script>

<style scoped lang="stylus" src="./Home.styl"></style>
