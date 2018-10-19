<template>
    <div>
        <h4>我是第二层</h4>
        <grandson-c v-bind="$attrs" v-on="$listeners"></grandson-c>
    </div>
</template>

<script>
    import GrandsonC from './GrandsonC';

    export default {
        name: '',
        components: {
            GrandsonC
        },
        data() {
            return {};
        },
        mounted() {
            console.log(this.$attrs);
            console.log(this.$listeners);
        },
        methods: {
            onEvent3() {
                console.log(
                    "我是【B】，这是从【C】组件中触发的事件，且继续$emit到【parent】"
                );
                this.$emit("sig_event3");
            }
        }
    };
</script>

<style>
</style>
