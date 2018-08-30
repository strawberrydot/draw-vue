<template>
    <div id="draw-test">
        <div style="float: left" class="left-part">

        </div>
        <div style="float: right" class="right-part">
            <canvas id="canvas"></canvas>
        </div>
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
            uuid () {
                function s4 () {
                    return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
                }
                return (
                    s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
                );
            }
        },
        created () {
            this.id = this.uuid();
        },
        mounted() {
            // 1.创建svg画布
            let marge = { top: 60, bottom: 60, left: 60, right: 60 };
            let width = 600;
            let height = 400;
            const svg = this.d3.select('.left-part').append('svg').attr('width', width).attr('height', height);
            let g = svg.append('g').attr('transform', 'translate(' + marge.top + ',' + marge.left + ')');
            // 2.数据集
            let dataset = [10, 20, 30, 23, 13, 40, 27, 35, 20, 33];
            // 3.坐标轴
            // x轴序数比例尺（this.d3.scaleBand()并不是一个连续性的比例尺，domain()中使用一个数组，不过range()需要是一个连续域）
            let ranges = this.d3.range(dataset.length);
            let xcale = this.d3.scaleBand().domain(ranges).range([0, width - marge.left - marge.right]);
            let xAxis = this.d3.axisBottom(xcale);
            g.append('g')
                .attr('transform', 'translate(' + 0 + ',' + (height - marge.top - marge.bottom) + ')')
                .call(xAxis);
            // y轴线性比例尺
            let yscale = this.d3.scaleLinear().domain([0, this.d3.max(dataset)]).range([height - marge.top - marge.bottom, 0]);
            let yAxis = this.d3.axisLeft(yscale);
            g.append('g')
                .attr('transform', 'translate(0, 0)')
                .call(yAxis);
            // 4.为每个矩形和对应的文字创建一个分组<g>
            let gs = g.selectAll('rect')
                .data(dataset)
                .enter()
                .append('g');
            // 5.绘制矩形
            // 设置矩形之间的间隙
            let rectPadding = 20;
            gs.append('rect')
                .attr('x', function(d, i) {
                    // xcale(i): 画布真实宽度(48)横坐标且从0开始, 0, 48, 96 ... 432
                    return xcale(i) + rectPadding / 2;
                })
                .attr('width', function() {
                    // xcale.step() 画布真实宽度(48):width-marge.left-marge.right/dataset.lenght
                    return xcale.step() - rectPadding;
                })
                .attr('y', function(d) {
                    let min = yscale.domain()[0];
                    // 0 ； yscale(0) --- 280
                    return yscale(min);
                    // 返回的是最大值 ;
                })
                .attr('height', function(d) {
                    // 默认开始高度为0
                    return 0;
                })
                .attr('fill', '#0098FC')
                .transition()
                .duration(1000)
                .delay(function(d, i) {
                    return i * 200;
                })
                //  .ease(this.d3.easeElasticInOut)
                .attr('y', function(d) {
                    return yscale(d);
                })
                .attr('height', function(d) {
                    return height - marge.top - marge.bottom - yscale(d);
                });
            // canvas
            let data = [
                {city: "北京", number: 345, color: "red"},
                {city: "上海", number: 645, color: "green"},
                {city: "广州", number: 545, color: "#369"},
                {city: "深圳", number: 945, color: "purple"}
            ];
            let x = 100;
            let y = 500;// 原点坐标
            let xWidth = 50;
            let yWidth = 40;
            let canvas = document.getElementById('canvas');
            let canvasCtx = canvas.getContext('2d');
            canvas.width = 800;
            canvas.height = 600;
            // 绘制坐标轴
            canvasCtx.save();
            canvasCtx.translate(x, y);
            canvasCtx.beginPath();
            // x轴
            canvasCtx.moveTo(0, 0);
            canvasCtx.lineTo(xWidth * 9, 0);
            canvasCtx.lineTo(xWidth * 9 - 10, -10);
            canvasCtx.moveTo(xWidth * 9, 0);
            canvasCtx.lineTo(xWidth * 9 - 10, 10);

            // y轴
            canvasCtx.moveTo(0, 0);
            canvasCtx.lineTo(0, -yWidth * 11);
            canvasCtx.lineTo(-10, -yWidth * 11 + 10);
            canvasCtx.moveTo(0, -yWidth * 11);
            canvasCtx.lineTo(10, -yWidth * 11 + 10);

            // 刻度
            canvasCtx.textAlign = "end";
            canvasCtx.textBaseline = "middle";
            for(let i = 0; i <= 10; i++) {
                canvasCtx.moveTo(0, -i * yWidth);
                canvasCtx.lineTo(10, -i * yWidth);
                canvasCtx.fillText(i * 100, -10, -i * yWidth);
            }
            canvasCtx.strokeStyle = "black";
            canvasCtx.stroke();

            // 绘制状图
            canvasCtx.beginPath();
            canvasCtx.textAlign = "center";
            canvasCtx.textBaseline = "top";
            data.forEach(function(item, index) {
                canvasCtx.fillStyle = item.color;
                canvasCtx.fillRect(index * 2 * xWidth + xWidth, -item.number / 100 * yWidth, xWidth, item.number / 100 * yWidth);
                canvasCtx.fillText(item.city, index * 2 * xWidth + xWidth + xWidth / 2, 10);
            });

            canvasCtx.restore();
        }
    };
</script>

<style lang="less">

</style>
