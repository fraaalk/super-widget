import Vue from 'vue';
import Vuex from 'vuex';
import Viewport from './../store/modules/viewport';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    now: Date.now(),
    activeLayout: 'movies',
    days: [],
    movies: {},
    shows: [],
    components: {},
  },
  mutations: {
    ADD_COMPONENT(state, payload) {
      Vue.set(state.components, payload.componentId, payload.data);
    },
    UPDATE_COMPONENT(state, payload) {
      state.components[payload.componentId] = payload.data;
    },
    ADD_SLIDE(state, payload) {
      state.components[payload.carouselId].slides.push(payload.data);
    },
    ADD_MOVIE(state, payload) {
      Vue.set(state.movies, payload.movieId, payload.data);
    },
    UPDATE_MOVIE(state, payload) {
      state.movies[payload.movieId] = payload.data;
    },
  },
  actions: {
    addMovie: (context, payload) => {
      context.commit('ADD_MOVIE', payload);
    },
    updateMovie: (context, payload) => {
      context.commit('UPDATE_MOVIE', payload);
    },
  },
  getters: {
    shows: state => state.shows,
    days: state => state.days,
    now: state => state.now,
    config: state => state.config,
  },
  modules: [
    Viewport,
  ],
});
