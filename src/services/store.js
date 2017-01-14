import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    now: Date.now(),
    activeLayout: 'movies',
    days: [],
    components: [],
  },
  mutations: {
    ADD_COMPONENT(state, payload) {
      const newComponent = {
        id: payload.id,
        data: payload.data,
      };
      state.components.push(newComponent);
    },
    SET_SLIDE(state, payload) {
      const carousel = state.components.filter(component =>
        component.id === payload.id
      );

      carousel[0].data.currentSlide = payload.newSlide;
    },
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
