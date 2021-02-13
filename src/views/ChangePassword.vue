<template>
  <div class="changepwd">
    <van-nav-bar
      left-text="返回"
      title="安全中心"
      left-arrow
      @click-left="$router.go(-1)"
    />

    <div class="pwd-box">
      <div class="oldpwd">旧密码:</div>
      <input
        :type="checked ? 'text' : 'password'"
        class="old"
        v-model="oldpwd"
      />
      <div class="newpwd">新密码:</div>
      <input
        :type="checked ? 'text' : 'password'"
        class="new"
        v-model="newpwd"
      />
    </div>

    <div class="select">
      <van-button type="info" size="large" @click="determine">确定</van-button>
      <van-checkbox v-model="checked">显示密码</van-checkbox>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checked: false,
      oldpwd: "",
      newpwd: "",
    };
  },
  methods: {
    changestatus() {
      this.checked = !this.checked;
    },
    determine() {
        
      if (this.newpwd == this.oldpwd) {
        this.$toast({
          message: "新密码与旧密码一致",
          forbidClick: true,
          duration: 700,
        });
        return;
      }

      var reg = new RegExp(/^[a-zA-Z]\w{5,15}$/);
      let a = reg.test(this.newpwd);
      if (!a) {
        this.$toast({
          message: "密码支持字母数字下划线 首字符必须为字母",
          forbidClick: true,
          duration: 700,
        });
        return;
      }

      
      this.$axios({
        method: "post",
        url: "updatePassword",
        data: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: this.$cookies.get("tokenString"),
          password: this.newpwd,
          oldPassword: this.oldpwd,
        },
      }).then((res) => {
        console.log(res);
        this.$toast({
          message: res.data.msg,
          forbidClick: true,
          duration: 700,
        });
        this.$router.push({name: "Login"})
      });

   
    },
  },
};
</script>

<style lang="less" scoped>
.changepwd {
  background-color: #eee;
  height: 100vh;
  .pwd-box {
    margin-top: 30px;
    div {
      font-size: 14px;
      padding: 0 15px;
      margin-bottom: 7px;
      color: #888;
    }
    .newpwd {
      margin-top: 20px;
    }
    input {
      width: 100vw;
      height: 30px;
      border: none;
      outline: none;
      padding: 0 15px;
      box-sizing: border-box;
    }
  }
  .select {
    padding: 15px;
    margin-top: 10px;
    button {
      height: 50px;
      margin-bottom: 10px;
    }
  }
}
</style>