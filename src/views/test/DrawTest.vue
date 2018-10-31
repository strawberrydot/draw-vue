<template>
    <div id="draw-test">
        <div class="left-content">

        </div>
        <div class="right-content">

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
        },
        created () {
        },
        mounted() {

        }
    };
</script>

<style lang="less">
    #draw-test {
        width: 100%;
        height: 100%;
        .left-content {
            height: 100%;
            background-color: rgb(255, 255, 255);
            position: relative;
            box-sizing: border-box;
            border-right: 1px solid rgb(239, 242, 247);
            width: 200px;
            padding-top: 189px;
            float: left;
            z-index: 1;
        }
        .right-content {
            overflow: hidden;
            height: 100%;
            position: relative;
            box-sizing: border-box;
        }
    }
</style>
