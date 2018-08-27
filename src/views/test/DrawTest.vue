<template>
    <div id="draw-test">

    </div>
</template>

<script>
    export default {
        name: "DrawTest",
        mounted() {
            let width = 900;
            let height = 800;
            let svg = this.d3.select('#draw-test').append('svg').attr('width', width).attr('height', height).attr('fill', '#0098FC');

        }
    };
</script>

<style>

</style>
