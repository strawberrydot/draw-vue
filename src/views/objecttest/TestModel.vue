<template>
    <div id="test">
        这是一个测试
    </div>
</template>

<script>

    export default {
        name: '',
        data() {
            return {
            };
        },
        mounted() {
            let view = document.getElementById('test');
            let obj = {};
            let i = 0;
            Object.defineProperty(obj, 'name', {
                get: function () {
                    console.log('get it');
                    return 2;
                },
                set: function (newValue) {
                    console.log('set it');
                    console.log(newValue);
                    view.innerHTML = newValue;
                }
            });
            let interval = setInterval(function () {
                i++;
                console.log(obj.name);
                obj.name = '值更新了，我要更新视图' + i;
                if (i === 3) {
                    clearInterval(interval);
                }
            }, 1000);
        }
    };
</script>

<style>
</style>
