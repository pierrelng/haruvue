import Vue from 'vue';
import Router from 'vue-router';
import Hello from '@/components/Hello/Hello';
import Home from '@/components/Home/Home';
import Event from '@/components/Event/Event';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/hello',
      name: 'Hello',
      component: Hello,
    },
    {
      path: '/event/:id',
      name: 'Event',
      component: Event,
    },
  ],
});
