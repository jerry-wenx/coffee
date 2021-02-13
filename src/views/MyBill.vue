<template>
  <div class="mybill">
    <van-nav-bar
      left-text="返回"
      title="我的订单"
      left-arrow
      @click-left="gomy"
    />
    我的订单
  </div>
</template>

<script>
export default {
  methods: {
    gomy() {
      this.$router.go(-1);
    },
  },

  created(){
    this.$axios({
      method: "get",
      url: 'findOrder',
      params: {
        appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
        tokenString: this.$cookies.get("tokenString"),
        status: "1"
      }
    }).then( res=> {
      console.log(res);
    })
  },
};
</script>

<style lang="less" scoped>
</style>