var workflow = {
    nodes: {}
};

const CIRCLE_RADIUS = 5;

var defaultData =
    {
        nodes: [
            {
                id: 1,
                dataId: 1,
                x: 283,
                y: 32,
                text: "数据连接",
                inputs: 1,
                outputs: 1,
                status: 1,
                type: 1
            },
            {
                id: 2,
                dataId: 2,
                x: 152,
                y: 142,
                text: "选择分析列",
                inputs: 2,
                outputs: 2,
                status: 1,
                type: 2
            }],
        links: [
            {
                id: 11,
                fromId: 1,
                toId: 2,
                source: [283, 32],
                target: [152, 142],
                inPort: 1,
                outPort: 1,
                fromOutputs: 1,
                toInputs: 2
            },
            {
                id: 12,
                fromId: 1,
                toId: 2,
                source: [283, 32],
                target: [152, 142],
                inPort: 2,
                outPort: 1,
                fromOutputs: 1,
                toInputs: 2
            }
        ]
    };
var nodes = [];
var links = [];

var tooltip;

$(function() {
    var svg = d3.select("svg");

    if (defaultData && defaultData.nodes) {
        defaultData.nodes.forEach(item => {
            var g = addNode(svg, item);
            addEvents(g);
        });
    }

    if (defaultData && defaultData.links) {
        defaultData.links.forEach(item => {
            addLink(svg, item);
        });
    }

    // 绑定拖拽
    $('#left-wrapper .node').draggable({
        helper: "clone",
        addClass: false,
        connectToSortable: "#idsw-bpmn",
        start: function (e, ui) {
            ui.helper.addClass("ui-draggable-helper");
        },
        drag: function (e, ui) {

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
                status: 1,
                type: 1
            };

            if (node.dataId == 101) {
                node.inputs = 0;
                node.outputs = 1;
                node.status = 2;
            } else if (node.dataId == 102) {
                node.inputs = 1;
                node.outputs = 0;
                node.type = 2;
            } else if (node.dataId == 216) {
                node.inputs = 1;
                node.outputs = 2;
                node.type = 3;
            } else {
                node.inputs = 3;
                node.outputs = 3;
                node.type = 4;
            }
            // 计算节点编号
            if (workflow.nodes[node.dataId]) {
                workflow.nodes[node.dataId] += 1;
            } else {
                workflow.nodes[node.dataId] = 1;
            }

            // add node
            defaultData.nodes.push(node);

            var g = addNode(svg, node);
            addEvents(g);

        }
    });
});

var activeLine = null;
var points = [];
var translate = null;
var drawLine = false;
let nearestNum = [];
let end;
let link = {};

/* add */
var optNum = 0;
var optWidth = 0;
var rectWidth = 180;
var rectHeight = 36;
// 建议固定rect宽高，因为后续连线涉及到计算
// 若text超出宽度，可省略以...显示，点击节点，右边会有对应详情显示

/* 事件绑定 */
function addEvents(g) {
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

    // d3.selectAll('.node').data(defaultData);

    g.selectAll("circle.input")
        .on("mouseover", function (d, i, target) {
            if (drawLine) {
                d3.selectAll("circle.end").classed("end", false);
                d3.select(this).classed("end", true);
            }
        }).on("mouseout", function () {
            if (drawLine) {
                d3.selectAll("circle.end").classed("end", false);
            }
        });
    /*增加 鼠标移出入参时，移除.end，此时不添加line*/

    g.selectAll("rect").on("mouseover", function (d, i, target) {
        if (drawLine) {
            nearestNum = [];
            console.log('拖拽入rect范围内');
            d3.selectAll("rect.flag").classed("flag", false);
            d3.select(this).classed("flag", true);
            var num = d3.select(this.parentNode).attr('inputs');
            var transform = d3.select(this.parentNode).attr("transform");
            var tran = getTranslate(transform);
            var rectWidth = d3.select(this.parentNode).node().getBoundingClientRect().width;
            let array = [];
            for (var i = 1;i <= num;i++) {
                array.push(i * (rectWidth / (+num + 1)) + tran[0]) ;
            }
            nearestNum[0] = getNearestNum(array, points[1][0]);
            end = nearestNum[0] - tran[0];
            nearestNum[1] = +tran[1] - CIRCLE_RADIUS;
            /* 额外减5 是连线终点的位置再减去圆的半径 使连线不超过圆内 */
            let cNum = end / (rectWidth / (+num + 1));
            d3.select(d3.select(this.parentNode).selectAll('circle.input').nodes()[cNum - 1]).classed('end', true);
        }
    });

    // tooltip
    g.selectAll("text.rightIcon").on("mouseover", function() {
        // d3.select(d3.select(this.parentNode).node()) 获取到g标签 然后在获取g上面的type属性
        let type = +d3.select(d3.select(this.parentNode).node()).attr("type");
        let typeStr = getTypeStr(type);
        tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .attr("class", "hover")
            .text(typeStr);
        return tooltip.style("visibility", "visible");
    }).on("mousemove", function() {
        return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
    }).on("mouseout", function() {
        tooltip.remove();
        return tooltip.style("visibility", "hidden");
    });

}

function linestarted() {
    drawLine = false;
    // 当前选中的circle
    var anchor = d3.select(this);
    // 当前选中的节点
    var node = d3.select(this.parentNode);
    var rect = node.node().getBoundingClientRect();
    rectWidth = rect.width;
    rectHeight = rect.height;

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

    /* 输出个数 和 每个输出之间的平均宽度 */
    optNum = +node.attr("outputs");
    optWidth = rect.width / (+node.attr("outputs") + 1);

    /* 连线时区分当前所选节点与其他节点 background */
    d3.selectAll('rect').attr('stroke', 'green').attr('stroke-dasharray', '5');
    d3.select(this.parentNode).select('rect').attr('stroke', '#333').attr('stroke-dasharray', 'none');

    /* 有效的出入点 区分 */
    d3.selectAll('circle.output').classed('invalid', true);
    d3.select(this).classed('invalid', false);
    d3.selectAll('circle.input').classed('valid', true);
    d3.select(this.parentNode).selectAll('circle.input').classed('valid', false);


    link.outPort = +anchor.attr("output");
    link.fromOutputs = +node.attr("outputs");
}

function linedragged() {
    drawLine = true;
    points[1] = [d3.event.x + translate[0], d3.event.y + translate[1]];
    activeLine.attr("d", function () {
        return "M" + points[0][0] + "," + points[0][1]
            + "C" + points[0][0] + "," + (points[0][1] + points[1][1]) / 2
            + " " + points[1][0] + "," + (points[0][1] + points[1][1]) / 2
            + " " + points[1][0] + "," + points[1][1];
    });
}

function lineended(d) {
    drawLine = false;
    var anchor = d3.selectAll("circle.end");

    if (anchor.empty()) {
        activeLine.remove();
    } else {
        var pNode = d3.select(anchor.node().parentNode);
        var inputNum;
        inputNum = +pNode.attr('inputs');
        var input = pNode.node().getBoundingClientRect().width / (inputNum + 1);
        let index = anchor.attr("input");

        // 吸附优化 todo
        if (nearestNum && nearestNum.length) {
            activeLine.attr("d", function () {
                return "M" + points[0][0] + "," + points[0][1]
                    + "C" + points[0][0] + "," + (points[0][1] + points[1][1]) / 2
                    + " " + points[1][0] + "," + (points[0][1] + points[1][1]) / 2
                    + " " + nearestNum[0] + "," + nearestNum[1];
            });
        }
        anchor.classed("end", false);
        activeLine.attr("to", pNode.attr("id"));
        activeLine.attr("input", anchor.attr("input"));
        /* path C end 位置计算修正 */
        activeLine.attr("end", input * index + ", 0");

        if (+activeLine.attr("from") === +pNode.attr("id")) {
            // 解决bug 同一个.node上的出入参可生成连线
            activeLine.remove();
        } else {
            // anchor.attr("data-type", +activeLine.attr("from") + ", " +pNode.attr("id"));
        }

        // add link
        link.fromId = activeLine.attr("from");
        link.toId = activeLine.attr("to");
        link.source = translate;
        link.target = getTranslate(pNode.attr("transform"));
        link.inPort = +anchor.attr("input");
        link.toInputs = +pNode.attr('inputs');

        defaultData.links.push(link);
        // 新增后，刷新，重新绘制，因为需要给path对应的id
        // todo
    }
    activeLine = null;
    points.length = 0;
    translate = null;
    link = {};
    d3.selectAll('rect').attr('stroke-dasharray', 'none');
    d3.selectAll('circle.output').classed('invalid', false);
    d3.selectAll('circle.input').classed('valid', false);

}

function getTranslate(transform) {
    var arr = transform.substring(transform.indexOf("(") + 1, transform.indexOf(")")).split(",");
    return [+arr[0], +arr[1]];
}

function getNearestNum(array, val) {
    if (array && array.length) {
        array.push(val);
        let index = array.sort().indexOf(val);
        if (index) {
            if (val - array.sort()[index - 1] >= array.sort()[index + 1] - val) {
                return array.sort()[index + 1];
            } else {
                return array.sort()[index - 1];
            }
        } else {
            return array.sort()[index + 1];
        }
    } else {
        return false;
    }
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
        .each(function () {
            var start = d3.select(this).attr("start").split(",");
            start[0] = +start[0] + t1[0];
            start[1] = +start[1] + t1[1];

            var path = d3.select(this).attr("d");
            var end = path.substring(path.lastIndexOf(" ") + 1).split(",");
            end[0] = +end[0];
            end[1] = +end[1];

            d3.select(this).attr("d", function () {
                return "M" + start[0] + "," + start[1]
                    + " C" + start[0] + "," + (start[1] + end[1]) / 2
                    + " " + end[0] + "," + (start[1] + end[1]) / 2
                    + " " + end[0] + "," + end[1];
            });

            // edit link path的id在数据库中是唯一的，通过当前id去查找，然后更新位置值
            link.id = d3.select(this).attr("id");
            link.source = [start[0], start[1]];
            // todo
        });

    // 更新输入线的位置
    d3.selectAll('path[to="' + id + '"]')
        .each(function (d, index) {
            var path = d3.select(this).attr("d");
            var start = path.substring(1, path.indexOf("C")).split(",");
            start[1] = +start[1];
            var end = d3.select(this).attr("end").split(",");
            end[0] = +end[0] + t1[0];
            end[1] = +end[1] + t1[1] - CIRCLE_RADIUS;
            d3.select(this).attr("d", function () {
                return "M" + start[0] + "," + start[1]
                    + " C" + start[0] + "," + (start[1] + end[1]) / 2
                    + " " + end[0] + "," + (start[1] + end[1]) / 2
                    + " " + end[0] + "," + end[1];
            });

            // edit link path的id在数据库中是唯一的，通过当前id去查找，然后更新位置值
            link.id = d3.select(this).attr("id");
            link.target = [end[0], end[1]];

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
        .attr("transform", 'translate(' + node.x + ', ' + node.y + ')')
        .attr("type", node.type);

    var rect = g.append("rect")
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("stroke-width", 2)
        .attr("stroke", "#333")
        .attr("fill", "#fff");
    // todo
    // rect内容过大，高度不固定时，计算时要获取当前高度？？

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
        .text('\uf00c')
        .attr("class", "rightIcon");

    // input circle
    var inputs = node.inputs || 0;
    g.attr("inputs", inputs);
    for (var i = 0; i < inputs; i++) {
        g.append("circle")
            .attr("class", "input")
            .attr("input", (i + 1))
            .attr("cx", width * (i + 1) / (inputs + 1))
            .attr("cy", 0)
            .attr("r", CIRCLE_RADIUS);
    }

    // output circle
    var outputs = node.outputs || 0;
    g.attr("outputs", outputs);
    for (i = 0; i < outputs; i++) {
        g.append("circle")
            .attr("output", (i + 1))
            .attr("class", "output")
            .attr("cx", width * (i + 1) / (outputs + 1))
            .attr("cy", height)
            .attr("r", CIRCLE_RADIUS);
    }

    return g;
}

// 绘制连线
function addLink(svg, link) {
    let dx = (rectWidth/(link.fromOutputs + 1)) * link.outPort;
    let dy = rectHeight + CIRCLE_RADIUS;
    let endX = (rectWidth/(link.toInputs + 1)) * link.inPort;
    let endY = 0;
    let points = [];
    points.push([dx + link.source[0], dy + link.source[1]]);
    points[1] = [endX + link.target[0], link.target[1]];

    let path = svg.append('path')
        .attr("class", "cable")
        .attr("id", link.id)
        .attr("from", link.fromId)
        .attr("to", link.toId)
        .attr("output", link.fromOutputs)
        .attr("input", link.toInputs)
        .attr("start", dx + ", " + dy)
        .attr("end", endX + ", " + endY)
        .attr("d", function () {
        return "M" + points[0][0] + "," + points[0][1]
            + "C" + points[0][0] + "," + (points[0][1] + points[1][1]) / 2
            + " " + points[1][0] + "," + (points[0][1] + points[1][1]) / 2
            + " " + points[1][0] + "," + (+points[1][1] - CIRCLE_RADIUS);
    });

    console.log(svg.selectAll('circle'));

    return path;
}

function getTypeStr(type) {
    let result = "";
    switch(type) {
        case 1 :
            result = "this is data tooltip";
            break;
        case 2:
            result = "this is a simple tooltip";
            break;
    }
    return result;
}
