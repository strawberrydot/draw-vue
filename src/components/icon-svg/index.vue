<template>
    <svg class="svg-icon" aria-hidden="true" @click="iconClick" v-show="loaded" focusable="false">
        <use :xlink:href="iconName"></use>
    </svg>
</template>

<script>
    function defaultClick() {

    };
    export default {
        name: 'icon-svg',
        props: {
            iconClass: {
                type: String,
                required: true
            },
            selfClick: {
                type: Function,
                default: defaultClick
            }
        },
        computed: {
            iconName() {
                return `#icon-${this.iconClass}`;
            }
        },
        data() {
            return {
                loaded: false
            };
        },
        created() {
            this.$nextTick(() => {
                this.loaded = true;
            });
        },
        methods: {
            iconClick() {
                this.selfClick();
            }
        }
    };
</script>

<style>

</style>