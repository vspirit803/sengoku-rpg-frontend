import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    settings: {
      bgm: {
        muted: false,
        volume: 0.5,
      },
    },
  },
  getters: {},
  mutations: {},
  actions: {},
  modules: {},
});
