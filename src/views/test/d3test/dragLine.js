var svg = d3.select('svg').node();
d3.select('svg').on('mousemove', function() {
    if (dragging) {
        var rad = 5;
        var x = d3.mouse(d3.select('#a').node())[0],
            y = d3.mouse(d3.select('#a').node())[1];
        d3.select('#dummyPath').attr('x2', x - rad).attr('y2', y - rad);
        d3.select('#dummyPath').style("display", "block")
    }
});

d3.select('#a').call(d3.behavior.drag()
    .origin(function() {
        var t = d3.select(this);
        return {
            x: t.attr("x") + d3.transform(t.attr("transform")).translate[0],
            y: t.attr("y") + d3.transform(t.attr("transform")).translate[1]
        };
    })
    .on('drag', function() {
        d3.select(this).attr('transform', 'translate(' + d3.event.x + ',' + d3.event.y + ')');

    }));

d3.selectAll('.e')
    .call(d3.behavior.drag()
        .origin(function() {
            var t = d3.select(this);
            return {
                x: t.attr("x") + d3.transform(t.attr("transform")).translate[0],
                y: t.attr("y") + d3.transform(t.attr("transform")).translate[1]
            };
        })
        .on('dragstart', function() {
            d3.event.sourceEvent.stopPropagation();
        })
        .on('drag', function() {
            var g = d3.select(this);
            var parent = d3.select('#a').select('rect');
            var current = d3.select(this).select('rect');
            var dx = d3.event.x;
            var dy = d3.event.y;

            var x, y;


            if (((Number(current.attr('x')) + dx) > Number(parent.attr('width')))) {
                console.log('x case');
                x = Number(parent.attr('width')) - Number(current.attr('width')) - Number(current.attr('x'));
            } else if (dx < 0 && (Number(current.attr('x')) - Number(parent.attr('x')) + dx) < 0) {
                x = -1 * Number(current.attr('x')) + 20;
            } else {
                x = dx;
            }


            if (((Number(current.attr('y')) + dy) > Number(parent.attr('height')))) {
                y = Number(parent.attr('height')) - Number(current.attr('height')) - Number(current.attr('y'));

            } else if (dy < 0 && (Number(current.attr('y')) - Number(parent.attr('y')) + dy) < 0) {
                y = -1 * Number(current.attr('y')) + 20;
            } else {
                y = dy;
            }

            d3.select(this).attr('transform', 'translate(' + x + ',' + y + ')');
            d3.selectAll(".line")[0]
                .forEach(function(el) {
                    var d = d3.select(el).data()[0],
                        line = d3.select(el);
                    if (d.src == g.attr("id")) {
                        var pt = svg.createSVGPoint();
                        pt.x = parseInt(g.select("circle." + d.sPos).attr("cx"));
                        pt.y = parseInt(g.select("circle." + d.sPos).attr("cy"));
                        pt = pt.matrixTransform(g.node().getCTM());
                        pt = pt.matrixTransform(d3.select("#a").node().getCTM().inverse());
                        line.attr('x1', pt.x).attr('y1', pt.y);
                    } else if (d.tgt == g.attr("id")) {
                        var pt = svg.createSVGPoint();
                        pt.x = parseInt(g.select("circle." + d.ePos).attr("cx"));
                        pt.y = parseInt(g.select("circle." + d.ePos).attr("cy"));
                        pt = pt.matrixTransform(g.node().getCTM());
                        pt = pt.matrixTransform(d3.select("#a").node().getCTM().inverse());
                        line.attr('x2', pt.x)
                            .attr('y2', pt.y);
                    }
                });
        }))
    .on('dragend', function() {
        d3.select(this).call(d3.behavior.drag().origin(function() {

            var t = d3.select(this);
            return {
                x: t.attr("x"),
                y: t.attr("y")
            };
        }));
    });
var dragging = false;
var drag = d3.behavior.drag()
    .on("dragstart", function() {
        dragging = true;
        d3.event.sourceEvent.stopPropagation();
        var x = d3.mouse(d3.select('#a').node())[0],
            y = d3.mouse(d3.select('#a').node())[1];
        d3.select('#dummyPath').attr('x1', x).attr('y1', y);
    })
    .on("dragend", function() {
        var sCircle = d3.select(this);
        var eCircle = d3.select(d3.event.sourceEvent.target);
        dragging = false;
        if (d3.event.sourceEvent.target.tagName == "circle" && this != d3.event.sourceEvent.target) {
            var rad = 5;
            var source = d3.select(this.parentNode).attr("id");
            var target = d3.select(d3.event.sourceEvent.target.parentNode).attr("id");
            var x1 = d3.select('#dummyPath').attr('x1'),
                y1 = d3.select('#dummyPath').attr('y1'),
                x2 = d3.mouse(d3.select('#a').node())[0],
                y2 = d3.mouse(d3.select('#a').node())[1];
            d3.select("#a")
                .append("line")
                .datum({
                    src: source,
                    tgt: target,
                    sPos: sCircle.attr("class"),
                    ePos: eCircle.attr("class")
                })
                .attr("class", "line")
                .attr("x1", x1)
                .attr("y1", y1)
                .attr("x2", x2)
                .attr('y2', y2);
        }
        d3.select('#dummyPath').style("display", "none");

    });

d3.selectAll("circle").call(drag);
