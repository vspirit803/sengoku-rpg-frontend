import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueCompositionApi from '@vue/composition-api';
import vuetify from './plugins/vuetify';
import GeminiScrollbar from 'vue-gemini-scrollbar';

Vue.config.productionTip = false;
Vue.use(VueCompositionApi);
Vue.use(GeminiScrollbar as any);

new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
}).$mount('#app');
