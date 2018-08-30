<template>
    <div>
        <canvas id="canvas" width="500" height="800"></canvas>
    </div>
</template>

<script>
    export default {
        name: "example-canvas",
        data() {
            return {

            };
        },
        mounted() {
            let canvas = document.getElementById('canvas');
            let context = canvas.getContext('2d');
            let locationXY = [];
            context.fillStyle = '#0098FC';
            context.fillRect(100, 100, 150, 50);
            locationXY.push({x: 100, y: 100, r: 50, i: 1});
            context.beginPath();
            context.arc(150, 250, 50, 0, Math.PI * 2, true);
            context.fill();
            locationXY.push({x: 150, y: 250, r: 50, i: 2});
            context.closePath();

            context.beginPath();
            context.moveTo(150, 350);
            context.lineTo(175, 400);
            context.lineTo(125, 450);
            context.fill();
            context.closePath();

            canvas.addEventListener('click', function (e) {

            });

        },
        methods: {

        }
    };
</script>

<style>

</style>
