<template>
    <div id="login-page">

    </div>
</template>

<script>
    export default {
        name: "Login",
        created() {
            var obj = {
                value: 1,
                key: 2,
                getData: function() {
                    return 1;
                },
                get: function () {
                    return 'a';
                }
            };
            console.log(Object.getOwnPropertyDescriptor(obj, 'getData'));
        }
    };
</script>

<style>

</style>
