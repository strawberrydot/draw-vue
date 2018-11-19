<template>
    <div>
        <h3>多层组件通信</h3>
        <h5>这是一段来自组件C的消息：  {{test}}</h5>
        <child-b :message="message"
                 @handleInputFromC="handleInputFromC"
                 @sig_event3="onEvent3"
                 ref="childB"
        ></child-b>

    </div>
</template>

<script>
    import ChildB from './ChildB';

    export default {
        name: '',
        components: {
            ChildB
        },
        data() {
            return {
                message: 'I am your grandpa',
                test: ''
            };
        },
        beforeCreate() {
            console.log('beforeCreate');
            console.log(this.$refs);
        },
        created() {
            console.log('created');
            console.log(this.$refs);
        },
        beforeMount() {
            console.log('beforeMount');
            console.log(this.$refs);
        },
        mounted() {
            console.log('mounted');
            console.log(this.$refs);
        },
        beforeDestroy() {
            console.log('beforeCreate');
            console.log(this);
        },
        destroyed() {
            console.log('destroyed');
            console.log(this);
        },
        methods: {
            handleInputFromC(msg) {
                this.test = msg;
            },
            onEvent3() {
                console.log("我是【parent】，这是从【C】组件中触发的事件。");
            }
        }
    };
</script>

<style>
</style>
