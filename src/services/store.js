import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    now: Date.now(),
    activeLayout: 'movies',
    days: [],
    shows: [],
    components: {},
    viewport: {},
  },
  mutations: {
    UPDATE_VIEWPORT(state, payload) {
      state.viewport = payload;
    },
    ADD_COMPONENT(state, payload) {
      Vue.set(state.components, payload.componentId, payload.data);
    },
    UPDATE_COMPONENT(state, payload) {
      state.components[payload.componentId] = payload.data;
    },
    ADD_SLIDE(state, payload) {
      state.components[payload.carouselId].slides.push(payload.data);
    },
  },
  getters: {
    shows: state => state.shows,
    days: state => state.days,
    now: state => state.now,
    today: (state) => {
      const dateNow = new Date(state.now);
      return dateNow.setHours(0, 0, 0, 0);
    },
    currentBreakpoint: state => state.viewport.breakpoint,
  },
});
