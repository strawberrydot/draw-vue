import Vue from 'vue';
import Router from 'vue-router';
const WrapperView = resolve => require(['@/views/wrapper/WrapperView'], resolve);
const DrawTest = resolve => require(['@/views/test/DrawTest'], resolve);
const Examples = resolve => require(['@/views/test/Examples'], resolve);

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            component: WrapperView,
            name: 'DrawTest',
            children: [
                {
                    path: '/',
                    component: DrawTest
                }
            ]
        }
        // {
        //     path: '/',
        //     component: WrapperView,
        //     name: 'Examples',
        //     children: [
        //         {
        //             path: '/',
        //             component: Examples
        //         }
        //     ]
        // }
    ]
});
