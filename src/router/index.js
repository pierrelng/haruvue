import Vue from 'vue';
import Router from 'vue-router';
import Hello from '@/components/Hello/Hello';
import Home from '@/components/Home/Home';
import Event from '@/components/Event/Event';
import Venue from '@/components/Venue/Venue';
import Organizer from '@/components/Organizer/Organizer';
// import Standby from '@/components/Standby/Standby';
// import Love from '@/components/Love/Love';
import Categories from '@/components/Categories/Categories';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello,
    },
    // {
    //   path: '/',
    //   name: 'Standby',
    //   component: Standby,
    // },
    {
      path: '/home',
      name: 'Home',
      component: Home,
    },
    // {
    //   path: '/home',
    //   name: 'Standby',
    //   component: Standby,
    // },
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
    {
      path: '/organisateur/:id',
      name: 'Organizer',
      component: Organizer,
    },
    // {
    //   path: '/saythatyoulovemeee',
    //   name: 'Love',
    //   component: Love,
    // },
    {
      path: '/categories',
      name: 'Categories',
      component: Categories,
    },
  ],
});
