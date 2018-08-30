<template>
    <div id="header">
        <div class="header-left">
            <h5>Canvas Test</h5>
        </div>
        <div class="header-right">
            <i>
                <icon-svg iconClass="GitHub"></icon-svg>
            </i>
            <span>{{loginName}}</span>
        </div>
    </div>
</template>

<script>
  import IconSvg from '../../components/icon-svg/index';

  export default {
      name: "header-view",
      components: {
          IconSvg
      },
      data() {
          return {
              loginName: 'user'
          };
      }
  };
</script>

<style lang="less">
    #header {
        height: 48px;
        margin: 0 10px;
        box-sizing: border-box;
        .header-left {
            float: left;
        }
        .header-right {
            float: right;
            height: 48px;
            line-height: 48px;
        }
    }

</style>
