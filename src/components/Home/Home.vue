<template>
  <div>
    <!-- Search bar -->
    <form class="form" action="#" method="POST">
      <input class="form__input" type="search" name="main_search" value="" placeholder="chill, house, gratuit...">
      <input class="form__submit" type="submit" value="">
    </form>

    <!-- Date picker -->
    <div class="wrapper">
      <ul class="datepicker">
        <li class="datepicker__all">∞</li>
        <li class="datepicker__today">Auj</li>
        <li class="datepicker__other">Mercredi</li>
        <li class="datepicker__other">Jeudi</li>
        <li class="datepicker__other">Vendredi</li>
        <li class="datepicker__other">Samedi</li>
      </ul>
      <!-- <span>{{ now }}</span> -->
    </div>

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
    };
  },
  created() {
    setInterval(this.getNow, 1000);
  },
  methods: {
    getNow() {
      this.now = moment().format('MMMM Do YYYY, h:mm:ss a');
    },
  },
};
</script>

<style scoped lang="stylus" src="./Home.styl"></style>
