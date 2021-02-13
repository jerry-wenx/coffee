<template>
  <div class="safe">
    <!-- <div class="userdata"> -->
    <van-nav-bar
      left-text="返回"
      title="安全中心"
      left-arrow
      @click-left="gomy"
    />

    <div class="safe-box">
      <div class="changepwd" @click="$router.push({ name: 'ChangePwd' })">
        修改密码 <span> <van-icon name="arrow" /></span>
      </div>
      <!-- <div class="cancelaccount" @click="cancelaccount">
        注销账号 <span> <van-icon name="arrow" /></span>
      </div> -->
      <div class="cancelaccount" @click="logout">
        退出登录 <span> <van-icon name="arrow" /></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    gomy() {
      this.$router.go(-1);
    },
    changepwd() {
      this.$router.push({ name: "ChangePwd" });
    },
    cancelaccount() {},
    logout() {
      this.$dialog
        .confirm({
          message: "确认退出登录吗",
        })
        .then((res) => {
          // console.log(res);
          // 退出

          this.$store.commit("addgoodsList", "");
          this.$store.commit("changeGoodsCount", 0);
          this.$store.commit("delAllNewList");
          this.$store.commit("money", 0);
          
          this.$axios({
            method: "post",
            url: "logout",
            data: {
              appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
              tokenString: this.$cookies.get("tokenString"),
            },
          }).then((res) => {
            if (res.data.code == "F001") {
              this.$cookies.set("tokenString", "");
              this.$toast({
                message: "退出成功",
                forbidClick: true,
                duration: 500,
              });
              this.$router.push({ name: "Login" });
            }
          });
        })
        .catch((err) => {
          // console.log(err);
        });
    },
  },
};
</script>

<style lang="less" scoped>
.safe {
  .van-icon {
    line-height: 42px;
    color: #969eb3;
  }
  .safe-box {
    margin-top: 20px;
    div {
      padding: 0 15px;
      display: flex;
      justify-content: space-between;
      line-height: 42px;
      background-color: #fff;
      margin: 2px 0px;
    }
  }
}
</style>