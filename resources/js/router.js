import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from './views/Dashboard';

Vue.use(Router);

const routes = [
    {
        path: '/',
        name: 'dashboard',
        component: Dashboard
    },
    {
        path: '/companies',
        name: 'companies',
        component: () => import('./views/Companies')
    }
]

const router = new Router({
    routes: routes,
    linkActiveClass: 'active'
});

export default router;
