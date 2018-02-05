import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home/Home';
import Event from '@/components/Event/Event';
import Venue from '@/components/Venue/Venue';
import Organizer from '@/components/Organizer/Organizer';
import Categories from '@/components/Categories/Categories';
// import Hello from '@/components/Hello/Hello';
// import Standby from '@/components/Standby/Standby';
// import Love from '@/components/Love/Love';

Vue.use(Router);

export default new Router({
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (savedPosition) {
          console.log(savedPosition);
          resolve(savedPosition);
        }
      }, 500);
    });
  },
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/categories', // The earlier a route is defined, the higher priority it gets. https://router.vuejs.org/en/essentials/dynamic-matching.html
      name: 'Categories',
      component: Categories,
    },
    {
      path: '/:tag',
      name: 'Tag',
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
    {
      path: '/organisateur/:id',
      name: 'Organizer',
      component: Organizer,
    },
    // {
    //   path: '/tag/:tag',
    //   name: 'Tag',
    //   component: Home,
    // },
    // {
    //   path: '/',
    //   name: 'Hello',
    //   component: Hello,
    // },
    // {
    //   path: '/',
    //   name: 'Standby',
    //   component: Standby,
    // },
    // {
    //   path: '/home',
    //   name: 'Standby',
    //   component: Standby,
    // },
    // {
    //   path: '/saythatyoulovemeee',
    //   name: 'Love',
    //   component: Love,
    // },
  ],
});
