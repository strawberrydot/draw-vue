<template>
    <div>
        <h3>多层组件通信</h3>
        <h5>这是一段来自组件C的消息：  {{test}}</h5>
        <child-b :message="message"
                 @handleInputFromC="handleInputFromC"
                 @sig_event3="onEvent3"
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
        mounted() {
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
