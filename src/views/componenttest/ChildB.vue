<template>
    <div>
        <h4>我是第二层</h4>
        <grandson-c v-bind="$attrs" v-on="$listeners"></grandson-c>
    </div>
</template>

<script>
    import GrandsonC from 'GrandsonC';

    export default {
        name: '',
        components: {
            GrandsonC
        },
        props: {
            message: [String]
        },
        data() {
            return {};
        }
    };
</script>

<style>
</style>
