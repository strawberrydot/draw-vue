import Vue from 'vue';
import Router from 'vue-router';
const WrapperView = resolve => require(['@/views/wrapper/WrapperView'], resolve);
const DrawTest = resolve => require(['@/views/test/DrawTest'], resolve);
const Examples = resolve => require(['@/views/test/Examples'], resolve);
const TestModel = resolve => require(['@/views/objecttest/TestModel'], resolve);
const ParentA = resolve => require(['@/views/componenttest/ParentA'], resolve);
const Login = resolve => require(['@/views/login/Login'], resolve);

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            component: WrapperView,
            name: 'Login',
            children: [
                {
                    path: '/',
                    component: Login
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
