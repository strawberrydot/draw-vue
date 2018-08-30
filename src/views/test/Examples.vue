<template>
    <div id="examples">
        <div style="float: left" class="left-part">
            <example-svg></example-svg>
        </div>
        <div style="float: right" class="right-part">
            <example-canvas></example-canvas>
        </div>
    </div>
</template>

<script>
    import ExampleSvg from './ExampleSvg';
    import ExampleCanvas from './ExampleCanvas';

    export default {
        name: "examples",
        components: {
            ExampleSvg,
            ExampleCanvas
        },
        data() {
            return {

            };
        },
        mounted() {

        },
        methods: {

        }
    };
</script>

<style>

</style>
