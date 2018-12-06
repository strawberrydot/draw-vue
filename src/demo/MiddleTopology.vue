<template>
    <div class="experiment-middle-topology">
        <div class="experiment-title">
            <p class="left">{{title}}</p>
            <p class="right">{{status}}</p>
        </div>
        <div id="idsw-bpmn" class="bpmn" style="position: relative; width: 100%; height: 100%;">
            <svg width="100%" height="100%" id="svgCanvas">
            </svg>
        </div>
    </div>
</template>

<script>
    import 'jquery-ui/ui/widgets/draggable';
    import 'jquery-ui/ui/widgets/sortable';

    export default {
        name: 'experiment-middle-topology',
        data() {
            return {
                title: "实验名称",
                status: "编辑中"
            };
        }
    };


</script>

<style lang="less">
    @import '../../../../../styles/topology.less';

    .experiment-middle-topology {
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 200px;
        right: 250px;
        background: #F5F6F7;
        .experiment-title {
            width: 100%;
            padding: 22px 24px;
            p {
                display: inline-block;
                font-size: 14px;
                color: #181B1D;
            }
            .left {
                float: left;
                font-size: 20px;
            }
            .right {
                float: right;
            }
        }
    }
</style>
