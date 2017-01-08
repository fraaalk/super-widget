/* eslint-disable */

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    now: Date.now(),
    activeLayout: 'movies',
    days: [],
  },
  getters: {
    days: state => state.days,
    now: state => state.now,
    today: (state) => {
      const dateNow = new Date(state.now);
      return dateNow.setHours(0, 0, 0, 0);
    },
  },
});
