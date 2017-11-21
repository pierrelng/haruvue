<template>
  <div>
    <!-- Search bar -->
    <!-- <form class="form" action="#" method="POST">
      <input class="form__input" type="search" name="main_search" value="" placeholder="chill, house, gratuit...">
      <input class="form__submit" type="submit" value="">
    </form> -->

    <date-picker></date-picker>
    <event-list></event-list>

  </div>
</template>

<script>
import DatePicker from '@/components/Home/DatePicker/DatePicker';
import EventList from '@/components/Home/EventList/EventList';

export default {
  name: 'home',
  components: {
    'date-picker': DatePicker,
    'event-list': EventList,
  },
};
</script>

<style scoped lang="stylus" src="./Home.styl"></style>
