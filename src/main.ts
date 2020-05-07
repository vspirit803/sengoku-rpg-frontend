import App from './App.vue';
import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;
Vue.use(VueCompositionApi);

new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
}).$mount('#app');
