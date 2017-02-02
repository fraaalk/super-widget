import Vue from 'vue';
import Vuex from 'vuex';
import DataLayer from './../services/data-layer';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    now: Date.now(),
    activeLayout: 'movies',
    days: [],
    shows: [],
    components: {},
    viewport: {},
    config: DataLayer.get('config'),
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
    config: state => state.config,
    currentBreakpoint: state => state.viewport.breakpoint,
  },
});
