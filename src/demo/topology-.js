import * as d3 from 'd3';

const CIRCLE_RADIUS = 2;

var topology = {
    workflow: {
        nodes: []
    },
    nodes: [],
    links: [],
    activeLine: null,
    points: [],
    translate: null,
    drawLine: false,
    nearestNum: [],
    end: null,
    link: {},
    linked: false,
    /* add */
    optNum: 0,
    optWidth: 0,
    rectWidth: 140,
    rectHeight: 36,
// 建议固定rect宽高，因为后续连线涉及到计算
// 若text超出宽度，可省略以...显示，点击节点，右边会有对应详情显示
    tooltip: null,
    init: function () {
        var svg = d3.select("#svgCanvas");

        if (defaultData && defaultData.nodes) {
            defaultData.nodes.forEach(item => {
                var g = topology.addNode(svg, item);
                topology.addEvents(g);
            });
        }

        if (defaultData && defaultData.links) {
            defaultData.links.forEach(item => {
                topology.addLink(svg, item);
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
                // 不同type对应不同node
                // ui.position 表示相对当前对象，鼠标的坐标值对象{top,left}

                // ui.helper.attr('data-id')获取到id，然后拿到当前node相关配置信息，示例如下

                var node = {
                    id: new Date().getTime(),
                    dataId: ui.helper.attr('data-id'),
                    x: ui.position.left - 200,
                    y: ui.position.top + 30,
                    text: ui.helper.text(),
                    inputs: 1,
                    outputs: [
                        {
                            injectNodes: [{

                            }]
                        },
                        {
                            injectNodes: [{

                            }]
                        }
                    ],
                    status: 1,
                    type: 1
                };

                if (node.dataId === 101) {
                    node.inputs = 0;
                    node.outputs = 1;
                    node.status = 2;
                } else if (node.dataId === 102) {
                    node.inputs = 1;
                    node.outputs = 0;
                    node.type = 2;
                } else if (node.dataId === 216) {
                    node.inputs = 1;
                    node.outputs = 2;
                    node.type = 3;
                } else {
                    node.inputs = 3;
                    node.outputs = 3;
                    node.type = 4;
                }
                // // 计算节点编号
                // if (this.workflow.nodes[node.dataId]) {
                //     this.workflow.nodes[node.dataId] += 1;
                // } else {
                //     this.workflow.nodes[node.dataId] = 1;
                // }

                // add node
                defaultData.nodes.push(node);

                var g = topology.addNode(svg, node);
                topology.addEvents(g);

            }
        });
    },
    addNode: function(svg, node) {
        // let type = node.type;

        var g = svg.append("g")
            .attr("class", "node")
            .attr("data-id", node.dataId)
            .attr("id", node.id)
            .attr("transform", 'translate(' + node.x + ', ' + node.y + ')')
            .attr("type", node.type)
            .datum(node.outputs);

        var rect = g.append("rect")
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("stroke-width", 1)
            .attr("stroke", "#C9D2DD")
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
            .attr("text-anchor", "middle").style("font-size", "12px")
            .style("color", "#464C50");

        // left icon
        g.append('svg:foreignObject')
            .attr("width", 16)
            .attr("height", 16)
            .attr("class", "foreign-object")
            .append("xhtml:body")
            .html('<i class="iconfont">&#xe77d;</i>');


        // right icon

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
        var outputs = node.outputs.length || 0;
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
    },
    addLink: function(svg, link) {
        let dx = (this.rectWidth / (link.fromOutputs + 1)) * link.outPort;
        let dy = this.rectHeight + CIRCLE_RADIUS;
        let endX = (this.rectWidth / (link.toInputs + 1)) * link.inPort;
        let endY = 0;
        let points = [];
        points.push([dx + link.source[0], dy + link.source[1]]);
        points[1] = [endX + link.target[0], link.target[1]];

        // 解决定点之间只能添加一条path的思路：根据toId找到node，根据入参数据找到这个circle，给circle添加data-type属性
        {
            let toId = link.toId;
            svg.selectAll('g').nodes().forEach(item => {
                if (+d3.select(item).attr("id") === toId) {
                    let inCircle = d3.select(item).selectAll('circle.input').nodes()[link.inPort - 1];
                    let tempStr = link.outPort + "@" + "(" + link.fromId + ", " + link.toId + ")";
                    if (d3.select(inCircle).attr("data-type")) {
                        tempStr = d3.select(inCircle).attr("data-type") + "&" + tempStr;
                    }
                    d3.select(inCircle).attr("data-type", tempStr);
                }
            });
        }

        // 注意：在.node上通过datum()方法绑定了data，在此节点上的circle，通过datum()方法居然可以获取到.node上的data

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
                return "M" + points[0][0] + "," + points[0][1] +
                    "C" + points[0][0] + "," + (points[0][1] + points[1][1]) / 2 +
                    " " + points[1][0] + "," + (points[0][1] + points[1][1]) / 2 +
                    " " + points[1][0] + "," + (+points[1][1] - CIRCLE_RADIUS);
            });

        return path;
    },
    addEvents: function (g) {
        g.call(
            d3.drag()
                .on("start", topology.dragstarted)
                .on("drag", topology.dragged)
                .on("end", topology.dragended)
        );

        g.selectAll("circle.output").call(
            d3.drag()
                .on("start", topology.linestarted)
                .on("drag", topology.linedragged)
                .on("end", topology.lineended)
        );

        g.selectAll("circle.input")
            .on("mouseover", function (d, i, target) {
                if (topology.drawLine) {
                    let overCircle = d3.select(d3.select(this).node()).classed('invalid');
                    d3.selectAll("circle.end").classed("end", false);
                    if (!overCircle) {
                        d3.select(this).classed("end", true);
                    } else {
                        topology.nearestNum = [];
                    }
                }
            }).on("mouseout", function () {
                if (topology.drawLine) {
                    d3.selectAll("circle.end").classed("end", false);
                }
            });
        /*  增加 鼠标移出入参时，移除.end，此时不添加line */

        d3.selectAll('g').on("mouseover", function (d, i, target) {
            if (topology.drawLine) {
                topology.nearestNum = [];
                d3.selectAll("rect.flag").classed("flag", false);
                d3.select(this).select("rect").classed("flag", true);
                var num = d3.select(this).attr('inputs');
                var transform = d3.select(this).attr("transform");
                var tran = getTranslate(transform);
                var rectWidth = d3.select(this).node().getBoundingClientRect().width;
                let array = [];
                for (let i = 1; i <= num; i++) {
                    array.push(i * (rectWidth / (+num + 1)) + tran[0]);
                }
                if (array && array.length) {
                    topology.nearestNum[0] = getNearestNum(array, topology.points[1][0]);
                    topology.end = topology.nearestNum[0] - tran[0];
                    topology.nearestNum[1] = +tran[1] - CIRCLE_RADIUS;
                    /* 额外减 是连线终点的位置再减去圆的半径 使连线不超过圆内 */
                    let cNum = Math.ceil(topology.end / (rectWidth / (+num + 1)));
                    let overCircle = d3.select(d3.select(this).selectAll('circle.input').nodes()[cNum - 1]).classed('invalid');
                    if (!overCircle) {
                        d3.select(d3.select(this).selectAll('circle.input').nodes()[cNum - 1]).classed('end', true);
                    } else {
                        topology.nearestNum = [];
                    }
                }
            }
        }).on("mouseout", function () {
            d3.selectAll('circle.input').classed('end', false);
            topology.nearestNum = [];
        }).on("click", function (e, index, list) {
            if (topology.clickNode) {
                let id = list[index].getAttribute('data-id');
                list.forEach((el, position) => {
                    if (position === index) {
                        d3.select(el).select("rect").attr('stroke', '#0B96E5');
                        // el.setAttribute('class', '');
                    } else {
                        d3.select(el).select("rect").attr('stroke', '#C9D2DD');
                    }
                });
                topology.clickNode(id, d3.event);
            }
        });

        // tooltip
        g.selectAll("text.rightIcon").on("mouseover", function () {
            // d3.select(d3.select(this.parentNode).node()) 获取到g标签 然后在获取g上面的type属性
            if (topology.drawLine) {
                return;
            }
            let type = +d3.select(d3.select(this.parentNode).node()).attr("type");
            let typeStr = getTypeStr(type);
            topology.tooltip = d3.select("body")
                .append("div")
                .style("position", "absolute")
                .style("z-index", "10")
                .style("visibility", "hidden")
                .attr("class", "hover")
                .text(typeStr);
            return topology.tooltip.style("visibility", "visible");
        }).on("mousemove", function () {
            if (topology.drawLine) {
                return;
            }
            return topology.tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
        }).on("mouseout", function () {
            if (topology.drawLine) {
                return;
            }
            topology.tooltip.remove();
            return topology.tooltip.style("visibility", "hidden");
        });

        // svg 鼠标右键
        d3.selectAll('#svgCanvas').on('contextmenu', function () {
            d3.event.preventDefault();
        }).on('mousedown', function (oEvent) {
            if (!oEvent) oEvent = window.event;
            if (oEvent.button === 2) {

            }
        }).on('mouseup', function (oEvent) {
            if (!oEvent) oEvent = window.event;
            if (oEvent.button === 2) {

            }
        });
    },
    linestarted: function () {
        topology.drawLine = false;
        // 当前选中的circle
        var anchor = d3.select(this);
        // 当前选中的节点
        var node = d3.select(this.parentNode);

        //  distinguish code
        {
            // 思路：拿到可连的type,根据type确定节点。找到节点上的input，然后改变对应的css
            let outputIndex = anchor.attr('output');
            let map = {};
            if (node.datum() && node.datum().length) {
                let tempArray = node.datum()[outputIndex - 1].injectNodes;
                tempArray.forEach(item => {
                    let key = item.type;
                    map[key] = key;
                    let input = item.type + 'input';
                    map[input] = item.input;
                });
            }
            d3.selectAll('g').nodes().forEach(item => {
                let targetType = +d3.select(item).attr("type");
                if(map[targetType]) {
                    // map内存在这个type
                    let targetInput = targetType + 'input';
                    // 拿到当前type对应节点上可连的input index - 1
                    // 先让所有circle都标记一个颜色，然后再给可连的circle标记另外一个颜色
                    d3.selectAll('circle').classed('invalid', true);
                    anchor.classed('invalid', false);
                    map[targetInput].forEach(term => {
                        let inputCircles = d3.select(item).selectAll("circle.input").nodes();
                        d3.select(inputCircles[term - 1]).classed('invalid', false);
                        d3.select(inputCircles[term - 1]).classed('valid', true);
                    });
                }
            });
        }

        var rect = node.node().getBoundingClientRect();
        topology.rectWidth = rect.width;
        if (+node.attr("inputs")) {
            topology.rectHeight = rect.height - CIRCLE_RADIUS;
        } else {
            // 当前节点无入参时
            topology.rectHeight = rect.height;
        }

        /*  校正 计算线的起始位置 */
        var dx = (rect.width / (+node.attr("outputs") + 1)) * (anchor.attr("output"));
        var dy = topology.rectHeight;

        var transform = node.attr("transform");
        topology.translate = getTranslate(transform);
        topology.points.push([dx + topology.translate[0], dy + topology.translate[1]]);
        topology.activeLine = d3.select("#svgCanvas")
            .append("path")
            .attr("class", "cable")
            .attr("from", node.attr("id"))
            .attr("start", dx + ", " + dy)
            .attr("output", d3.select(this).attr("output"));
        /*  .attr("marker-end", "url(#arrowhead)"); */

        /* 输出个数 和 每个输出之间的平均宽度 */
        topology.optNum = +node.attr("outputs");
        topology.optWidth = rect.width / (+node.attr("outputs") + 1);

        /* 连线时区分当前所选节点与其他节点 background */
        d3.selectAll('rect').attr('stroke', 'green').attr('stroke-dasharray', '5');
        d3.select(this.parentNode).select('rect').attr('stroke', '#333').attr('stroke-dasharray', 'none');

        /* 有效的出入点 区分 */
        // d3.selectAll('circle.output').classed('invalid', true);
        // d3.select(this).classed('invalid', false);
        // d3.selectAll('circle.input').classed('valid', true);
        // d3.select(this.parentNode).selectAll('circle.input').classed('valid', false);
        // d3.select(this.parentNode).selectAll('circle.input').classed('invalid', false);

        topology.link.outPort = +anchor.attr("output");
        topology.link.fromOutputs = +node.attr("outputs");
    },
    linedragged: function () {
        topology.drawLine = true;
        topology.points[1] = [d3.event.x + topology.translate[0], d3.event.y + topology.translate[1]];

        /*
           注：当前node节点上绑定的数据集中如果定义了x,y，会影响当前d3.event.x和d3.event.y的值，修改为别的变量则不会影响，如a:133,b:145
           故，在addNode()方法中，使用datum()方法只绑定了node.outputs的值，反正其他的值都可以在node.attr()属性上获取到
        */
        // 吸附优化
        if (topology.nearestNum && topology.nearestNum.length) {
            topology.activeLine.attr("d", function () {
                return "M" + topology.points[0][0] + "," + topology.points[0][1] +
                    "C" + topology.points[0][0] + "," + (topology.points[0][1] + topology.points[1][1]) / 2 +
                    " " + topology.points[1][0] + "," + (topology.points[0][1] + topology.points[1][1]) / 2 +
                    " " + topology.nearestNum[0] + "," + topology.nearestNum[1];
            });
        } else {
            topology.activeLine.attr("d", function () {
                return "M" + topology.points[0][0] + "," + topology.points[0][1] +
                    "C" + topology.points[0][0] + "," + (topology.points[0][1] + topology.points[1][1]) / 2 +
                    " " + topology.points[1][0] + "," + (topology.points[0][1] + topology.points[1][1]) / 2 +
                    " " + topology.points[1][0] + "," + topology.points[1][1];
            });
        }
    },
    lineended: function () {
        topology.drawLine = false;
        var anchor = d3.selectAll("circle.end");
        let dataType;

        if (anchor.empty()) {
            topology.activeLine.remove();
            anchor.classed("end", false);
        } else {
            var pNode = d3.select(anchor.node().parentNode);

            if (anchor.attr("data-type")) {
                let comparedArray = [];
                comparedArray.push(+topology.activeLine.attr("from"));
                comparedArray.push(+pNode.attr("id"));
                dataType = anchor.attr("data-type").split("&");
                dataType.forEach(item => {
                    let tempArray = item.split("@");
                    let linkedIds = getTranslate(tempArray[1]);
                    if (linkedIds.toString() === comparedArray.toString()) {
                        if (+tempArray[0] === topology.link.outPort) {
                            topology.activeLine.remove();
                            anchor.classed("end", false);
                            return;
                        }
                    }
                });
            }

            var inputNum;
            inputNum = +pNode.attr('inputs');
            var input = pNode.node().getBoundingClientRect().width / (inputNum + 1);
            let index = anchor.attr("input");

            anchor.classed("end", false);
            topology.activeLine.attr("to", pNode.attr("id"));
            topology.activeLine.attr("input", anchor.attr("input"));
            /* path C end 位置计算修正 */
            topology.activeLine.attr("end", input * index + ", 0");

            // add link
            topology.link.fromId = topology.activeLine.attr("from");
            topology.link.toId = topology.activeLine.attr("to");
            topology.link.source = topology.translate;
            topology.link.target = getTranslate(pNode.attr("transform"));
            topology.link.inPort = +anchor.attr("input");
            topology.link.toInputs = +pNode.attr('inputs');

            if (+topology.activeLine.attr("from") === +pNode.attr("id")) {
                // 解决bug 同一个.node上的出入参可生成连线
                topology.activeLine.remove();
            } else {
                var tempStr = topology.link.outPort + "@" + "(" + topology.link.fromId + ", " + topology.link.toId + ")";
                if (anchor.attr("data-type")) {
                    tempStr = anchor.attr("data-type") + "&" + tempStr;
                }
                anchor.attr("data-type", tempStr);
            }

            defaultData.links.push(this.link);
            // 新增后，刷新，重新绘制，因为需要给path对应的id
            // todo
        }
        topology.activeLine = null;
        topology.points.length = 0;
        topology.translate = null;
        topology.linked = false;
        topology.link = {};
        topology.nearestNum = [];
        d3.selectAll('rect').attr('stroke-dasharray', 'none');
        d3.selectAll('circle.output').classed('invalid', false);
        d3.selectAll('circle.input').classed('invalid', false);
        d3.selectAll('circle.input').classed('valid', false);

    },
    dragstarted: function () {
        var transform = d3.select(this).attr("transform");
        var translate = getTranslate(transform);
        dx = d3.event.x - translate[0];
        dy = d3.event.y - translate[1];
        dragElem = d3.select(this);
    },
    updateCable: function(elem) {
        // var bound = elem.node().getBoundingClientRect();
        // var width = bound.width;
        // var height = bound.height;
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
                    return "M" + start[0] + "," + start[1] +
                        " C" + start[0] + "," + (start[1] + end[1]) / 2 +
                        " " + end[0] + "," + (start[1] + end[1]) / 2 +
                        " " + end[0] + "," + end[1];
                });

                // edit link path的id在数据库中是唯一的，通过当前id去查找，然后更新位置值
                topology.link.id = d3.select(this).attr("id");
                topology.link.source = [start[0], start[1]];
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
                    return "M" + start[0] + "," + start[1] +
                        " C" + start[0] + "," + (start[1] + end[1]) / 2 +
                        " " + end[0] + "," + (start[1] + end[1]) / 2 +
                        " " + end[0] + "," + end[1];
                });

                // edit link path的id在数据库中是唯一的，通过当前id去查找，然后更新位置值
                topology.link.id = d3.select(this).attr("id");
                topology.link.target = [end[0], end[1]];

            });
    },
    dragged: function () {
        dragElem.attr("transform", "translate(" + (d3.event.x - dx) + ", " + (d3.event.y - dy) + ")");
        topology.updateCable(dragElem);
    },
    dragended: function () {
        dx = dy = 0;
        dragElem = null;
    }
};


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
                outputs: [
                    {
                        injectNodes: [{
                            type: 2,
                            input: [1, 2]
                        }]
                    }],
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
                outputs: [
                    {
                        injectNodes: [{
                            type: 4,
                            input: [1]
                        }]
                    },
                    {
                        injectNodes: [{
                            type: 4,
                            input: [1]
                        }]
                    }],
                status: 1,
                type: 2
            },
            {
                id: 101,
                dataId: 101,
                x: 395,
                y: 142,
                text: "读数据",
                inputs: 0,
                outputs: [{
                    injectNodes: [{
                        type: 4,
                        input: [1]
                    }]
                }],
                status: 1,
                type: 3
            },
            {
                id: 102,
                dataId: 102,
                x: 277,
                y: 269,
                text: "写数据",
                inputs: 1,
                outputs: [],
                status: 1,
                type: 4
            }
        ],
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
            // {
            //     id: 12,
            //     fromId: 1,
            //     toId: 2,
            //     source: [283, 32],
            //     target: [152, 142],
            //     inPort: 2,
            //     outPort: 1,
            //     fromOutputs: 1,
            //     toInputs: 2
            // },
            {
                id: 13,
                fromId: 101,
                toId: 102,
                source: [395, 142],
                target: [277, 269],
                inPort: 1,
                outPort: 1,
                fromOutputs: 1,
                toInputs: 1
            },
            {
                id: 14,
                fromId: 2,
                toId: 102,
                source: [152, 142],
                target: [277, 269],
                inPort: 1,
                outPort: 2,
                fromOutputs: 2,
                toInputs: 1
            }
        ]
    };

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

function getTypeStr(type) {
    let result = "";
    switch (type) {
        case 1 :
            result = "this is data tooltip";
            break;
        case 2:
            result = "this is a simple tooltip";
            break;
        case 3 :
            result = "读数据";
            break;
        case 4:
            result = "写数据";
            break;
    }
    return result;
}

export {topology};
