<template>
  <div class="login">
    <HearBar></HearBar>

    <div class="text">
      <p class="ch">欢迎回来!</p>
      <p class="en">welcome back</p>
    </div>

    <div class="login-form">
      <div class="phone">
        <van-field
          v-model="userLoginInfo.phone"
          label="手机号"
          placeholder="请输入手机号"
        />
      </div>
      <van-field
        v-model="userLoginInfo.password"
        :type="isShowPsd ? 'text' : 'password'"
        :right-icon="isShowPsd ? 'eye-o' : 'closed-eye'"
        label="密码"
        placeholder="请输入密码"
        @click-right-icon="showPsd"
      />
      <p @click="repass">忘记密码？</p>
    </div>

    <div class="btns">
      <div class="login-btn">
        <van-button type="info" block round @click="login"
          >登&nbsp;&nbsp;录</van-button
        >
      </div>
      <div class="register-btn">
        <van-button block round @click="showPopup">注&nbsp;&nbsp;册</van-button>
      </div>
    </div>

    <!-- ==========点击注册弹出框====== -->
    <van-popup v-model="isPopup" position="bottom" closeable>
      <div class="registerinfo">
        <p>注册</p>
        <div class="login-form">
          <van-field
            v-model="userRegisterInfo.nickName"
            label="昵称"
            placeholder="请输入昵称"
          />
          <div class="phone">
            <van-field
              v-model="userRegisterInfo.phone"
              label="手机号"
              placeholder="请输入手机号"
            />
          </div>
          <van-field
            v-model="userRegisterInfo.password"
            :type="isShowPsd ? 'text' : 'password'"
            :right-icon="isShowPsd ? 'eye-o' : 'closed-eye'"
            @click-right-icon="showPsd"
            label="密码"
            placeholder="请输入密码"
          />
        </div>

        <div class="register-btn">
          <van-button type="info" block round @click="reg"
            >注&nbsp;&nbsp;册</van-button
          >
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import HearBar from "../components/HeadBar";
import "../assets/less/login.less";
import { utils } from "../assets/js/utils.js";
export default {
  name: "Login",
  components: { HearBar },
  data() {
    return {
      userLoginInfo: {
        phone: "",
        password: "",
      },
      userRegisterInfo: {
        phone: "",
        password: "",
        nickName: "",
      },
      isPopup: false,
      isShowPsd: false,
    };
  },
  methods: {
    showPsd() {
      this.isShowPsd = !this.isShowPsd;
    },
    showPopup() {
      this.isPopup = true;
    },
    repass() {
      this.$router.push({name: 'Repassword'});
    },

    //注册
    reg() {
      //   this.isPopup = false;
      let o = {
        phone: {
          value: this.userRegisterInfo.phone,
          reg: /^1[3-9]\d{9}$/,
          errorMsg: "手机号码格式错误",
        },
        password: {
          value: this.userRegisterInfo.password,
          reg: /^[a-zA-Z]\w{5,15}$/,
          errorMsg: "密码支持字母数字下划线 首字符必须为字母",
        },
        nickName: {
          value: this.userRegisterInfo.nickName,
          reg: /^[\u4e00-\u9fa5A-Za-z\d]{1,10}$/,
          errorMsg: "昵称支持汉字字母数字组合",
        },
      };

      if (!utils.verificationFrom(o)) {
        console.log("表单有误");
        return;
      } else {
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0,
        });

        this.axios({
          method: "post",
          url: "register",
          data: {
            appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
            nickName: this.userRegisterInfo.nickName,
            password: this.userRegisterInfo.password,
            phone: this.userRegisterInfo.phone,
          },
        })
          .then((data) => {
            // console.log(data);
            this.$toast.clear();
            if (data.data.code == 100) {
              this.isPopup = false;
              this.$toast({
                message: data.data.msg,
                duration: 3000,
                forbidClick: true,
              });
              for (let k in this.userRegisterInfo) {
                this.userRegisterInfo[k] = "";
              }
            } else {
              this.$toast({
                message: data.data.msg,
                duration: 3000,
                forbidClick: true,
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    //登录
    login() {
      let o = {
        phone: {
          value: this.userLoginInfo.phone,
          reg: /^1[3-9]\d{9}$/,
          errorMsg: "手机号码格式错误",
        },
        password: {
          value: this.userLoginInfo.password,
          reg: /^[a-zA-Z]\w{5,15}$/,
          errorMsg: "密码支持字母数字下划线 首字符必须为字母",
        },
      };

      if (!utils.verificationFrom(o)) {
        console.log("表单有误");
        return;
      } else {
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0,
        });

        this.axios({
          method: "post",
          url: "login",
          data: {
            appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
            password: this.userLoginInfo.password,
            phone: this.userLoginInfo.phone,
          },
        })
          .then((data) => {
            console.log(data);
            this.$toast.clear();
            if (data.data.code == 200) {
              //登录成功
                // console.log(1111);
              this.userLoginInfo.phone = '',
              this.userLoginInfo.password = '',
              this.$cookies.set("tokenString", data.data.token);
              this.isPopup = false;
              this.$toast({
                message: data.data.msg,
                duration: 500,
                forbidClick: true,
              });
              for (let k in this.userRegisterInfo) {
                this.userRegisterInfo[k] = "";
              }
              //跳转页面
              this.$store.commit("change", false);
              this.$router.push({name: "Home"});
            } else {
              //错误提示信息
              this.$toast({
                message: data.data.msg,
                duration: 500,
                forbidClick: true,
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
};
</script>
