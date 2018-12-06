<template>
    <div class="detail-root">
        <left-bar></left-bar>
        <middle-topology></middle-topology>
        <right-wrapper></right-wrapper>
    </div>
</template>

<script>
    import 'jquery-ui/ui/widgets/draggable';
    import LeftBar from './LeftBar';
    import RightWrapper from './RightWrapper';
    import MiddleTopology from './MiddleTopology';
    // import {topology} from './topology';
    import {topology} from './topology-';

    export default {
        name: 'demo-layout',
        components: {
            LeftBar,
            RightWrapper,
            MiddleTopology
        },
        data() {
            return {};
        },
        mounted() {
            setTimeout(() => {
                // topology();
                topology.init();
                topology.clickNode = this.clickNode;
            }, 0);
        },
        methods: {
            clickNode(id) {
                // console.log(id);
            }
        }
    };
</script>

<style lang="less">
    @import '../../../../../styles/topology.less';

    .detail-root {
        position: relative;
        height: 100%;
    }
</style>
