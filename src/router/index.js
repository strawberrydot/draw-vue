import Vue from 'vue';
import Router from 'vue-router';
const DrawTest = resolve => require(['@/views/test/DrawTest'], resolve);

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'DrawTest',
            component: DrawTest
        }
    ]
});
