import Vue from 'vue';
import Router from 'vue-router';
const WrapperView = resolve => require(['@/views/wrapper/WrapperView'], resolve);
const DrawTest = resolve => require(['@/views/test/DrawTest'], resolve);

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            component: WrapperView,
            name: '工作台',
            children: [
                {
                    path: '/',
                    component: DrawTest
                }
            ]
        }
    ]
});
