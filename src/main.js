// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import * as d3 from 'd3';
import IconSvg from '@/components/icon-svg'; // svg组件
import '@/assets/iconfont/iconfont.js';

Vue.config.productionTip = false;
Vue.prototype.d3 = d3;
// 如果你需要应用一个插件，同事他并不是基于vue.js的插件命令编写的，那么你可以将它赋予Vue的原型上
// 在使用的时候 this.XXX即可
Vue.component('icon-svg', IconSvg);

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
});
