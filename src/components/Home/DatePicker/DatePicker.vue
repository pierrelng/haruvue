<template>
  <div>
    <nav class="nav">
      <ul class="list scroll-x-wrapper">

        <!-- ALL -->
        <li class="list__item scroll-x-item" :class="{ 'list__item--active': isActive === 'all' }" @click="show('all')" ref="nextDays">
          <div class="list_label infinity" :class="{ 'infinity--active': isActive === 'all' }"></div>
        </li>

        <!-- TODAY -->
        <li class="list__item scroll-x-item" :class="{ 'list__item--active': isActive === 'today' }" @click="show('today')">
          <span class="list__label">Auj.</span>
        </li>

        <!-- TOMORROW -->
        <li class="list__item scroll-x-item" :class="{ 'list__item--active': isActive === 'tomorrow' }" @click="show('tomorrow')">
          <span class="list__label">Dem.</span>
        </li>

        <!-- NEXT DAYS -->
        <li class="list__item scroll-x-item" :class="{ 'list__item--active': isActive === index }" v-for="(day, index) in days"  @click="show(index)">
          <span class="list__label" v-if="!day.fullWord">{{ day.name }}. {{ day.number }}/{{ day.month }}</span>
          <span class="list__label" v-else>{{ day.name }}</span>
        </li>

        <!-- SHOW NEXT WEEK -->
        <li class="list__item scroll-x-item" @click="addNextWeek">
          <span class="list__label">Semaine suivante</span>
        </li>

      </ul>
    </nav>
  </div>
</template>

<script>
import moment from 'moment';
import bus from '@/main';

export default {
  name: 'date-picker',
  data() {
    return {
      days: [],
      isActive: 'all',
      endFirstWeek: '',
      today: moment().format('YYYY-MM-DD'),
      tomorrow: moment().add(1, 'days').format('YYYY-MM-DD'),
    };
  },
  created() {
    this.setDays();
    bus.$on('hasUrlDate', (date) => {
      if (this.today === date) {
        this.isActive = 'today';
      } else if (this.tomorrow === date) {
        this.isActive = 'tomorrow';
      } else {
        this.days.forEach((day, index) => {
          if (day.datetime.format('YYYY-MM-DD') === date) {
            this.isActive = index;
          }
        });
      }
    });
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
    show(target) {
      switch (target) {
        case 'all':
          this.selectedDay = '';
          bus.$emit('datePicked', this.selectedDay);
          this.isActive = target;
          this.$router.push({ path: this.$route.path });
          break;
        case 'today':
          this.selectedDay = moment().format('YYYY-MM-DD'); // quid quand une semaine est à cheval sur 2 mois ?
          bus.$emit('datePicked', this.selectedDay);
          this.isActive = target;
          this.$router.push({ path: this.$route.path, query: { j: this.selectedDay } });
          break;
        case 'tomorrow':
          this.selectedDay = moment().add(1, 'days').format('YYYY-MM-DD');
          bus.$emit('datePicked', this.selectedDay);
          this.isActive = target;
          this.$router.push({ path: this.$route.path, query: { j: this.selectedDay } });
          break;
        default:
          this.selectedDay = this.days[target].datetime.format('YYYY-MM-DD');
          bus.$emit('datePicked', this.selectedDay);
          this.isActive = target;
          this.$router.push({ path: this.$route.path, query: { j: this.selectedDay } });
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

<style scoped lang="stylus" src="./DatePicker.styl"></style>
