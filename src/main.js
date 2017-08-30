// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import { InfiniteScroll, Spinner } from 'mint-ui'; // http://mint-ui.github.io/docs/#/en2/infinite-scroll
import 'mint-ui/lib/style.css'; // http://mint-ui.github.io/docs/#/en2/quickstart
import App from './App';
import router from './router';

Vue.use(InfiniteScroll);
Vue.component(Spinner.name, Spinner); // http://mint-ui.github.io/docs/#/en2/spinner

const moment = require('moment'); // https://github.com/brockpetrie/vue-moment#configuration
require('moment/locale/fr');
Vue.use(require('vue-moment'), {
  moment,
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
