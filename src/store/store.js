import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    activePreview: {
      event: {
        id: '',
      },
      icon: '',
    },
  },
  mutations: {
    updateActivePreviewEventId(state, payload) {
      state.activePreview.event.id = payload; // eslint-disable-line no-param-reassign
      // https://stackoverflow.com/questions/44657142/vuex-mutations-and-airbnb-eslint --> for a better solution
    },
    updateActivePreviewIcon(state, payload) {
      state.activePreview.icon = payload; // eslint-disable-line no-param-reassign
    },
  },
});

export default store;
