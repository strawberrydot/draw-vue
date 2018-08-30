<template>
    <div style="width: 100%;height: 100%;padding-top: 48px;box-sizing: border-box;
    overflow: hidden;min-width: 1024px;position: relative">
        <div style="position: absolute;top: 0;height:48px;width:100%" ref="header">
            <header-view></header-view>
        </div>
        <div style="height: 100%;background-color: #F3F4F5;overflow: auto;"
             ref="content">
            <div style="height: 100%;">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
    import HeaderView from './HeaderView.vue';

    export default {
        components: {
            HeaderView
        },
        data() {
            return {
                expand: true,
                children: [],
                bottom: false,
                params: {}
            };
        },
        name: 'wrapper-view',
        mounted() {
        },
        beforeDestroy() {
        },
        methods: {}
    };
</script>

<style lang="less">
    .hidden-header {
        transform: translateY(-100%);
        transition: transform 150ms ease-in-out
    }

    .show-header {
        transform: translateY(0%);
        transition: transform 150ms ease-in-out
    }

    @keyframes enter-out {
        from {
            top: 25%;
        }
        to {
            top: 100%;
        }
    }

    @-webkit-keyframes enter-out /*Safari and Chrome*/ {
        from {
            top: 25%;
        }
        to {
            top: 100%;
        }
    }

    @keyframes enter-in {
        from {
            top: 100%;
        }
        to {
            top: 25%;
        }
    }

    @-webkit-keyframes enter-in /*Safari and Chrome*/ {
        from {
            top: 100%;
        }
        to {
            top: 25%;
        }
    }


    @keyframes content-height-out {
        from {
            height: 25%;
        }
        to {
            height: 100%;
        }
    }

    @-webkit-keyframes content-height-out /*Safari and Chrome*/ {
        from {
            height: 100%;
        }
        to {
            height: 25%;
        }
    }

    @keyframes content-height-in {
        from {
            height: 100%;
        }
        to {
            height: 25%;
        }
    }

    @-webkit-keyframes content-height-in /*Safari and Chrome*/ {
        from {
            height: 100%;
        }
        to {
            height: 25%;
        }
    }

</style>
