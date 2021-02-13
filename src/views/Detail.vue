<template>
  <div class="detail">
    <van-nav-bar
      title="标题"
      left-text="返回"
      right-text="按钮"
      left-arrow
      @click-left="onClickLeft"
    />
  </div>
</template>

<script>
export default {
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      console.log(vm.$route.params.id);
      vm.$axios({
        methods: "get",
        url: "productDetail",
        params: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          pid: vm.$route.params.id,
        },
      }).then((res) => {
        console.log(res);
      });
    });
  },
};
</script>





<style lang="less" scoped>
</style>