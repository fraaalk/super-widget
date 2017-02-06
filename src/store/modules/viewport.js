const state = {
  viewport: {},
};

const getters = {
  currentBreakpoint: theState => theState.viewport.breakpoint,
};

const mutations = {
  UPDATE_VIEWPORT(theState, payload) {
    theState.viewport = payload;
  },
};

const actions = {
  updateViewport: ({ commit }, payload) => {
    commit('UPDATE_VIEWPORT', payload);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
