<template>
    <div id="example-svg">
        <!--<svg width="500" height="800">-->
            <!--<rect x="100" y="150" width="150" height="50" fill="#0098FC"></rect>-->
        <!--</svg>-->
    </div>
</template>

<script>
    import * as d3 from 'd3';

    export default {
        name: "example-svg",
        data() {
            return {

            };
        },
        mounted() {
            let height = 800;
            let width = 500;
            let svg = this.d3.select('#example-svg').append('svg').attr('height', height).attr('width', width);
            let g = svg.append('g');
            g.append('rect').attr('x', 100).attr('y', 100).attr('height', 50).attr('width', 150).attr('fill', '#0098FC');
            g.append('circle').attr('cx', 150).attr('cy', 250).attr('r', 50).attr('fill', '#0098FC').on('mouseover', function() {
                d3.select('circle')
                    .transition()
                    .delay(150)
                    .duration(100)
                    .attr('fill', '#FCA77A');
            }).on('mouseout', function() {
                d3.select('circle')
                    .transition()
                    .delay(150)
                    .duration(100)
                    .attr('fill', '#0098FC');
            });
            // 多边形
            g.append('polygon').attr('points', '150 350, 175 400, 125 450').attr('fill', '#0098FC');
        },
        methods: {

        }
    };
</script>

<style>

</style>
 d
