<template>
    <div>
        <h3>多层组件通信</h3>
        <child-b :message="message"></child-b>
    </div>
</template>

<script>
    import ChildB from 'ChildB';

    export default {
        name: '',
        components: {
            ChildB
        },
        data() {
            return {
                message: 'I am your grandpa'
            };
        }
    };
</script>

<style>
</style>
