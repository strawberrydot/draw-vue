<template>
    <div class="experiment-left-bar" id="left-wrapper">
        <div>
            <el-tree :data="treeData" :props="defaultProps"
                     @node-click="handleNodeClick"
                     :render-content="renderContent"
                     :default-expand-all="true"

            ></el-tree>
        </div>

    </div>
</template>

<script>
    import IconSvg from '@/components/icon-svg/index';

    export default {
        name: 'experiment-left-bar',
        components: {
            IconSvg
        },
        data() {
            return {
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                treeData: [
                    {
                        id: 1,
                        parentIcon: 1,
                        label: '我的数据',
                        children: [{
                            id: 2,
                            label: 'MySQL数据源',
                            children: [ {
                                id: 3,
                                label: '患者信息表',
                                isLeaf: true
                            }]
                        },
                        {
                            id: 4,
                            label: 'HDFS数据源',
                            children: [{
                                id: 5,
                                label: '源',
                                isLeaf: true
                            }]
                        }]
                    },
                    {
                        id: 6,
                        parentIcon: 2,
                        label: '我的模型',
                        children: [{
                            id: 7,
                            label: '已训练模型',
                            children: [ {
                                id: 8,
                                label: '模型1',
                                isLeaf: true
                            }]
                        },
                        {
                            id: 9,
                            label: '已上传模型',
                            children: [{
                                id: 10,
                                label: '模型2',
                                isLeaf: true
                            }]

                        }]
                    },
                    {
                        id: 11,
                        label: '数据处理',
                        parentIcon: 3,
                        children: [{
                            id: 12,
                            label: '处理',
                            isLeaf: true
                        }]
                    }
                ],
                dataSheet: [],
                dataModel: [],
                dataProcess: []
            };
        },
        methods: {
            handleNodeClick() {
            },
            onSearchClick() {

            },
            renderContent(h, { node, data, store }) {
                if (data.isLeaf) {
                    return h('span', {
                        class: 'node',
                        attrs: {
                            'data-id': data.id
                        }
                    }, data.label);
                } else if (data.parentIcon) {
                    let element = [];
                    element.push(h('icon-svg', {
                        props: {
                            iconClass: 'fsb_data_sel'
                        },
                        style: {
                            fontSize: '16px',
                            color: '#499BC8'
                        }
                    }));
                    element.push(h('span', {
                        style: {
                            fontSize: '12px',
                            color: '#181B1D',
                            display: 'inline-block',
                            marginTop: '4px'
                        }
                    }, data.label));
                    return h('span', {
                        class: 'custom-tree-node'
                    }, element);
                } else {
                    return h('span', {
                        class: 'custom-tree-node'
                    }, data.label);
                }

            }
        }
    };
</script>

<style lang="less">
    .experiment-left-bar {
        width: 200px;
        float: left;
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 0px;
        background: #FFFFFF;
        border-right: solid 1px #e7e7e7;
        padding-left: 25px;
        z-index: 1;
        .search-input {
            margin-top: 35px;
            margin-bottom: 15px;
            border: 1px solid #C9D2DD;
            border-radius: 15px;
            background-color: #FFFFFF;
            font-size: 16px;
        }
        font-size: 12px;
        .custom-tree-node {
            color: #464C50;
        }
    }
</style>
