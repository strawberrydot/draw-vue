<template>
    <div id="draw-test">
        <h5 style="text-align: center">George Pig</h5>
        <canvas id="canvas" width="1000" height="1000"></canvas>
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
            let canvas = document.getElementById('canvas');
            let context = canvas.getContext('2d');

            // backgroud
            context.beginPath();
            context.fillStyle = '#0098FC';
            context.arc(500, 300, 200, Math.PI / 4, Math.PI, true);

            context.fill();
            context.closePath();
            context.fillStyle = '#0098FC';
            context.fillRect(300, 300, 400, 200);
        }
    };
</script>

<style lang="less">
    #draw-test {
        width: 100%;
        height: 100%;
    }
</style>
