import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/about',
        name: 'About',
        component: () => import(/* webpackChunkName: "views" */ '@/views/About.vue'),
    },
    {
        path: '/illustration',
        name: 'Illustration',
        component: () => import(/* webpackChunkName: "views" */ '@/views/Illustration.vue'),
    },
    {
        path: '/battle-select',
        name: 'battle-select',
        component: () => import(/* webpackChunkName: "views" */ '@/views/BattleSelect.vue'),
    },
    {
        path: '/backpack',
        name: 'backpack',
        component: () => import(/* webpackChunkName: "views" */ '@/views/Backpack.vue'),
    },
    {
        path: '/teams',
        name: 'teams',
        component: () => import(/* webpackChunkName: "views" */ '@/views/Teams.vue'),
    },
    {
        path: '/battle',
        name: 'battle',
        component: () => import(/* webpackChunkName: "battle" */ '@/views/Battle.vue'),
        props: true,
    },
    {
        path: '/test',
        name: 'test',
        component: () => import(/* webpackChunkName: "test" */ '@/views/Test.vue'),
        props: true,
    },
    {
        path: '/settings',
        name: 'settings',
        component: () => import(/* webpackChunkName: "settings" */ '@/views/Settings.vue'),
    },
];

const router = new VueRouter({
    routes,
});

export default router;
