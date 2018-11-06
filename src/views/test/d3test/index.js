var workflow = {
    nodes: {}
};
$(function() {
    var svg = d3.select("svg");
    // 绑定拖拽
    $('#left-wrapper .node').draggable({
        helper: "clone",
        addClass: false,
        connectToSortable: "#idsw-bpmn",
        start: function (e, ui) {
            ui.helper.addClass("ui-draggable-helper");
        },
        stop: function (e, ui) {
            var node = {
                id: new Date().getTime(),
                dataId: ui.helper.attr('data-id'),
                x: ui.position.left - 250,
                y: ui.position.top - 40,
                text: ui.helper.text(),
                inputs: 1,
                outputs: 2,
                status: 1
            };

            if(node.dataId == 101) {
                node.inputs = 0;
                node.outputs = 1;
                node.status = 2;
            } else if(node.dataId == 102) {
                node.inputs = 1;
                node.outputs = 0;
            } else {
                node.inputs = 6;
                node.outputs = 3;
            }
            // 计算节点编号
            if(workflow.nodes[node.dataId]) {
                workflow.nodes[node.dataId] += 1;
            } else {
                workflow.nodes[node.dataId] = 1;
            }
            var g = addNode(svg, node);

            g.call(
                d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended)
            );

            g.selectAll("circle.output").call(
                d3.drag()
                    .on("start", linestarted)
                    .on("drag", linedragged)
                    .on("end", lineended)
            );

            g.selectAll("circle.input")
                .on("mouseover", function(d, i, target) {
                    console.log(i);
                    if(drawLine) {
                        d3.selectAll("circle.end").classed("end", false);
                        d3.select(this).classed("end", true);
                    }
                }).on("mouseout", function() {
                    if(drawLine) {
                        d3.selectAll("circle.end").classed("end", false);
                    }
                });
            /*增加 鼠标移出入参时，移除.end，此时不添加line*/
            g.selectAll("rect").on("mouseover", function (d, i, target) {
               if (drawLine) {
                   console.log('拖拽入rect范围内');
               }
            });
        }
    });
});

var activeLine = null;
var points = [];
var translate = null;
var drawLine = false;

/* add */
var optNum = 0;
var optWidth = 0;

function linestarted() {
    drawLine = false;
    // 当前选中的circle
    var anchor = d3.select(this);
    // 当前选中的节点
    var node = d3.select(this.parentNode);
    var rect = node.node().getBoundingClientRect();
    /*校正 计算线的起始位置*/
    var dx = (rect.width / (+node.attr("outputs") + 1)) * (anchor.attr("output"));
    var dy = rect.height;
    var transform = node.attr("transform");
    translate = getTranslate(transform);
    points.push([dx + translate[0], dy + translate[1]]);
    activeLine = d3.select("svg")
        .append("path")
        .attr("class", "cable")
        .attr("from", node.attr("id"))
        .attr("start", dx + ", " + dy)
        .attr("output", d3.select(this).attr("output"));
        /*.attr("marker-end", "url(#arrowhead)");*/

    /* 增加输出个数 和 每个输出之间的平均宽度 */
    optNum = +node.attr("outputs");
    optWidth = rect.width / (+node.attr("outputs") + 1);

    /* 连线时区分当前所选节点与其他节点 */
    d3.selectAll('rect').attr('stroke', 'green').attr('stroke-dasharray', '5');
    d3.select(this.parentNode).select('rect').attr('stroke', '#333').attr('stroke-dasharray', 'none');
}

function linedragged() {
    drawLine = true;
    points[1] = [d3.event.x + translate[0], d3.event.y + translate[1]];
    activeLine.attr("d", function() {
        return "M" + points[0][0] + "," + points[0][1]
            + "C" + points[0][0] + "," + (points[0][1] + points[1][1]) / 2
            + " " + points[1][0] + "," +  (points[0][1] + points[1][1]) / 2
            + " " + points[1][0] + "," + points[1][1];
    });
}

function lineended(d) {
    drawLine = false;
    var anchor = d3.selectAll("circle.end");
    if(anchor.empty()) {
        activeLine.remove();
    } else {
        var pNode = d3.select(anchor.node().parentNode);
        var inputNum;
        inputNum = +pNode.attr('inputs');
        var input = pNode.node().getBoundingClientRect().width / (inputNum + 1);
        let index = anchor.attr("input");
        anchor.classed("end", false);
        activeLine.attr("to", pNode.attr("id"));
        activeLine.attr("input", anchor.attr("input"));
        /* path C end 位置计算修正 */
        activeLine.attr("end", (input * index) + ", 0");
    }
    activeLine = null;
    points.length = 0;
    translate = null;
    d3.selectAll('rect').attr('stroke-dasharray', 'none');

}

function getTranslate(transform) {
    var arr = transform.substring(transform.indexOf("(")+1, transform.indexOf(")")).split(",");
    return [+arr[0], +arr[1]];
}

var dx = 0;
var dy = 0;
var dragElem = null;
function dragstarted() {
    var transform = d3.select(this).attr("transform");
    var translate = getTranslate(transform);
    dx = d3.event.x - translate[0];
    dy = d3.event.y - translate[1];
    dragElem = d3.select(this);
}

function dragged() {
    dragElem.attr("transform", "translate(" + (d3.event.x - dx) + ", " + (d3.event.y - dy) + ")");
    updateCable(dragElem);
}

function updateCable(elem) {

    var bound = elem.node().getBoundingClientRect();
    var width = bound.width;
    var height = bound.height;
    var id = elem.attr("id");
    var transform = elem.attr("transform");
    var t1 = getTranslate(transform);

    // 更新输出线的位置
    d3.selectAll('path[from="' + id + '"]')
        .each(function() {
            var start = d3.select(this).attr("start").split(",");
            start[0] = +start[0] + t1[0];
            start[1] = +start[1] + t1[1];

            var path = d3.select(this).attr("d");
            var end = path.substring(path.lastIndexOf(" ") + 1).split(",");
            end[0] = +end[0];
            end[1] = +end[1];

            d3.select(this).attr("d", function() {
                return "M" + start[0] + "," + start[1]
                    + " C" + start[0] + "," + (start[1] + end[1]) / 2
                    + " " + end[0] + "," +  (start[1] + end[1]) / 2
                    + " " + end[0] + "," + end[1];
            });
        });

    // 更新输入线的位置
    d3.selectAll('path[to="' + id + '"]')
        .each(function(d, index) {
            var path = d3.select(this).attr("d");
            var start = path.substring(1, path.indexOf("C")).split(",");
            start[1] = +start[1];
            var end = d3.select(this).attr("end").split(",");
            end[0] = +end[0] + t1[0];
            end[1] = +end[1] + t1[1];
            d3.select(this).attr("d", function() {
                return "M" + start[0] + "," + start[1]
                    + " C" + start[0] + "," + (start[1] + end[1]) / 2
                    + " " + end[0] + "," +  (start[1] + end[1]) / 2
                    + " " + end[0] + "," + end[1];
            });
        });

}

function dragended() {
    dx = dy = 0;
    dragElem = null;
}

function addNode(svg, node) {
    var g = svg.append("g")
        .attr("class", "node")
        .attr("data-id", node.dataId)
        .attr("id", node.id)
        .attr("transform", 'translate(' + node.x + ', ' + node.y + ')');

    var rect = g.append("rect")
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("stroke-width", 2)
        .attr("stroke", "#333")
        .attr("fill", "#fff");

    var bound = rect.node().getBoundingClientRect();
    var width = bound.width;
    var height = bound.height;

    // text
    g.append("text")
        .text(node.text)
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("dominant-baseline", "central")
        .attr("text-anchor", "middle");

    // left icon
    g.append('text')
        .attr("x", 18)
        .attr("y", height / 2)
        .attr("dominant-baseline", "central")
        .attr("text-anchor", "middle")
        .attr('font-family', 'FontAwesome')
        .text('\uf1c0');

    // right icon
    g.append('text')
        .attr("x", width - 18)
        .attr("y", height / 2)
        .attr("dominant-baseline", "central")
        .attr("text-anchor", "middle")
        .attr('font-family', 'FontAwesome')
        .text('\uf00c');

    // input circle
    var inputs = node.inputs || 0;
    g.attr("inputs", inputs);
    for(var i = 0; i < inputs; i++) {
        g.append("circle")
            .attr("class", "input")
            .attr("input", (i + 1))
            .attr("cx", width * (i + 1) / (inputs + 1))
            .attr("cy", 0)
            .attr("r", 5);
    }

    // output circle
    var outputs = node.outputs || 0;
    g.attr("outputs", outputs);
    for(i = 0; i < outputs; i++) {
        g.append("circle")
            .attr("output", (i + 1))
            .attr("class", "output")
            .attr("cx", width * (i + 1) / (outputs + 1))
            .attr("cy", height)
            .attr("r", 5);
    }

    return g;
}
