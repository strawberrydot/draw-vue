<template>
    <div>
        <h5>我是第三层</h5>
        <input type="text" @input="handleInput" placeholder="我输入的内容可以传到我的各层父ji">
    </div>
</template>

<script>
    export default {
        name: '',
        data() {
            return {
                messageC: ''
            };
        },
        mounted() {
            this.$emit('c test');
            console.log(this.$attrs);
        },
        methods: {
            handleInput(e) {
                this.messageC = e.target.value;
                this.$emit('handleInputFromC', this.messageC);
            }
        }
    };
</script>

<style>
</style>
