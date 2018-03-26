// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import { InfiniteScroll, Spinner } from 'mint-ui'; // http://mint-ui.github.io/docs/#/en2/infinite-scroll
import 'mint-ui/lib/style.css'; // http://mint-ui.github.io/docs/#/en2/quickstart
import VueYoutube from 'vue-youtube';
// import VueAnalytics from 'vue-analytics';
import App from './App';
import router from './router';

Vue.use(InfiniteScroll);
Vue.component(Spinner.name, Spinner); // http://mint-ui.github.io/docs/#/en2/spinner

const moment = require('moment'); // https://github.com/brockpetrie/vue-moment#configuration
require('moment/locale/fr');
Vue.use(require('vue-moment'), {
  moment,
});

Vue.moment.updateLocale('fr', { // https://momentjs.com/docs/#/customization/weekday-names/
  weekdays: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
});

Vue.use(VueYoutube); // https://github.com/anteriovieira/vue-youtube

// Vue.use(VueAnalytics, { // https://github.com/MatteoGabriele/vue-analytics
//   id: 'UA-109134697-2',
//   router,
// });

Vue.config.productionTip = false;

const bus = new Vue(); // https://www.youtube.com/watch?v=jzh4zQcfB0o
export default bus; // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/prefer-default-export.md

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
