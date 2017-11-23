<template>
  <div>

    <search-bar></search-bar>
    <date-picker></date-picker>
    <event-list></event-list>

  </div>
</template>

<script>
import SearchBar from '@/components/Home/SearchBar/SearchBar';
import DatePicker from '@/components/Home/DatePicker/DatePicker';
import EventList from '@/components/Home/EventList/EventList';

export default {
  name: 'home',
  components: {
    'search-bar': SearchBar,
    'date-picker': DatePicker,
    'event-list': EventList,
  },
};
</script>

<style scoped lang="stylus" src="./Home.styl"></style>
