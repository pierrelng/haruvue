<template>
  <div>
    <!-- Search bar -->
    <!-- <form class="form" action="#" method="POST">
      <input class="form__input" type="search" name="main_search" value="" placeholder="chill, house, gratuit...">
      <input class="form__submit" type="submit" value="">
    </form> -->

    <!-- Date picker -->
    <ul class="datepicker scroll-x-wrapper">
      <li class="datepicker__all scroll-x-item" v-bind:class="{ active: isActive === 'all' }" v-on:click="updateDay('all')">
        <svg viewBox="0 0 200 200" style="width: 25px; height: 25px">
          <path fill="none" stroke="#FFFFFF" stroke-width="7" d="M100,100 C200,0 200,200 100,100 C0,0 0,200 100,100z" />
        </svg>
        <div class="line" v-bind:class="{ lineActive: isActive === 'all' }"></div>
      </li>
      <li class="scroll-x-item" v-bind:class="{ active: isActive === 'today' }" v-on:click="updateDay('today')">Auj.<div class="line" v-bind:class="{ lineActive: isActive === 'today' }"></div></li>
      <li class="scroll-x-item" v-bind:class="{ active: isActive === 'tomorrow' }" v-on:click="updateDay('tomorrow')">Dem.<div class="line" v-bind:class="{ lineActive: isActive === 'tomorrow' }"></div></li>
      <li class="scroll-x-item" v-bind:class="{ active: isActive === index }" v-for="(day, index) in days"  v-on:click="updateDay(index)">
        <span v-if="!day.fullWord">{{ day.name }}. {{ day.number }}/{{ day.month }}</span>
        <span v-else>{{ day.name }}</span>
        <div class="line" v-bind:class="{ lineActive: isActive === index }"></div>
      </li>
      <li class="scroll-x-item" v-on:click="addNextWeek">Semaine suivante<div class="line"></div></li>
    </ul>

    <event-list v-bind:selected-day="selectedDay"></event-list>

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
      days: [],
      selectedDay: '',
      isActive: 'all',
      endFirstWeek: '',
    };
  },
  created() {
    this.setDays();
  },
  methods: {
    setDays() {
      this.days = [];
      const sunday = moment().endOf('week');
      const daysUntilSunday = sunday.diff(moment(), 'days');
      if (daysUntilSunday > 1) {
        for (let i = 2; i <= daysUntilSunday; i += 1) {
          const datetime = moment().add(i, 'days');
          this.days.push(
            {
              datetime,
              number: datetime.format('DD'),
              name: this.uppercaseFirst(datetime.format('dddd')),
              fullWord: true,
            },
          );
        }
      } else {
        const endOfNextWeek = moment().endOf('week').add(7, 'days');
        const daysUntilEndOfNextWeek = endOfNextWeek.diff(moment(), 'days');
        for (let i = 2; i <= daysUntilEndOfNextWeek; i += 1) {
          const datetime = moment().add(i, 'days');
          this.days.push(
            {
              datetime,
              number: datetime.format('DD'),
              name: this.uppercaseFirst(datetime.format('dddd')),
              fullWord: true,
            },
          );
        }
      }
    },
    updateDay(target) {
      switch (target) {
        case 'all':
          this.selectedDay = '';
          this.isActive = target;
          break;
        case 'today':
          this.selectedDay = moment().format('YYYY-MM-DD'); // quid quand une semaine est à cheval sur 2 mois ?
          this.isActive = target;
          break;
        case 'tomorrow':
          this.selectedDay = moment().add(1, 'days').format('YYYY-MM-DD');
          this.isActive = target;
          break;
        default:
          this.selectedDay = this.days[target].datetime.format('YYYY-MM-DD');
          this.isActive = target;
      }
    },
    addNextWeek() {
      let lastDayPreviousWeek = this.days[this.days.length - 1].datetime.clone(); // https://momentjs.com/guides/#/lib-concepts/mutability/
      for (let i = 1; i <= 7; i += 1) {
        const datetime = lastDayPreviousWeek.clone().add(1, 'days');
        this.days.push(
          {
            datetime,
            number: datetime.format('DD'),
            name: this.uppercaseFirst(datetime.format('dddd')).substring(0, 3),
            month: datetime.format('MM'),
          },
        );
        lastDayPreviousWeek = datetime;
      }
    },
    uppercaseFirst(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
  },
};
</script>

<style scoped lang="stylus" src="./Home.styl"></style>
