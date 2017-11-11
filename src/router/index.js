import Vue from 'vue';
import Router from 'vue-router';
import Hello from '@/components/Hello/Hello';
import Home from '@/components/Home/Home';
import Event from '@/components/Event/Event';
import Venue from '@/components/Venue/Venue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello,
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
    },
    {
      path: '/event/:id',
      name: 'Event',
      component: Event,
    },
    {
      path: '/lieu/:id',
      name: 'Venue',
      component: Venue,
    },
  ],
});
