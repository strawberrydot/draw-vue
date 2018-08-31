<template>
    <div id="draw-test">
        <h5 style="text-align: center">George Pig</h5>
        <canvas id="canvas"></canvas>
    </div>
</template>

<script>
    export default {
        name: "draw-test",
        data () {
            return {
                id: ''
            };
        },
        methods: {
        },
        created () {
        },
        mounted() {
            let canvas = document.getElementById('#canvas');
            let context = canvas.getContext('2d');


        }
    };
</script>

<style lang="less">
    #draw-test {
        width: 100%;
        height: 100%;
    }
</style>
