<template>
  <div class="my">
    <div class="bg" :style="`background: url(${userBg}) center top`">
      <!-- <img class="auto-img" :src="userBg" /> -->
      <van-uploader
        :after-read="afterRead"
        :max-count="1"
        :max-size="500 * 1024"
        accept="image/png,image/jpg,image/jpeg"
      />
    </div>
    <div class="personaldata">
      <div class="person-name">{{ nickName }}</div>
      <div class="person-detail">
        <div class="head-img">
          <img class="auto-img" :src="userImg" alt="" />
        </div>
        <div class="user-describe">
          {{ desc ? desc : "这家伙很懒，什么也没有留下!" }}
        </div>
      </div>

      <div class="other">
        <div class="user-data" @click="user">个人资料 <span> <van-icon name="arrow" /></span></div>
        <div class="mybill" @click="mybill">我的订单 <span> <van-icon name="arrow" /></span></div>
        <div class="address-manage" @click="manage">
          地址管理 <span> <van-icon name="arrow" /></span>
        </div>
        <div class="safe" @click="safe">安全中心<span> <van-icon name="arrow" /></span></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userImg: "",
      nickName: "",
      userBg: "",
      desc: "",
    };
  },
  methods: {
    user() {
      this.$router.push({ name: "UserData" });
    },
    mybill() {
      this.$router.push({ name: "Bill" });
    },
    manage() {
      this.$router.push({ name: "Manage" });
    },
    safe() {
      this.$router.push({ name: "Safe" });
    },





     // 上传背景头像
    afterRead(val) {
      //限制上传文件类型
      let types = ["png", "jpg", "jpeg"];

      //截取上传图片的类型
      let type = val.file.type.split("/")[1];
      console.log("type ==> ", type);

      if (types.indexOf(type) === -1) {
        return this.$toast({
          message: `文件类型只支持${types.join(",")}`,
          forbidClick: true,
          duration: 700,
        });
      }

      let base64 = val.content.replace(/data:image\/[A-Za-z]+;base64,/, "");

      //发起上传图片请求
      let tokenString = this.$cookies.get("tokenString");

      if (!tokenString) {
        console.log("浏览器token不存在");
        return this.$router.push({ name: "Login" });
      }

      // this.$toast.loading({
      //   message: "加载中...",
      //   forbidClick: true,
      //   duration: 0,
      // });

      // return;
      this.axios({
        //请求方式
        method: "POST",
        url: "updateUserBg",
        data: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: tokenString,
          imgType: type,
          serverBase64Img: base64,
        },
      }).then((res) => {
        console.log(res);

        if (res.data.code === "I001") {
          if (res.data.result[0] === 1) {
            // console.log(res.data.userImg);
            this.userBg = res.data.userBg;
          }
        }
      });
    },
  },

  created() {
    if (!this.$cookies.get("tokenString")) {
      this.$router.push({ name: "Login" });
      return;
    }

    this.$axios({
      method: "get",
      url: "findMy",
      params: {
        appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
        tokenString: this.$cookies.get("tokenString"),
      },
    }).then((res) => {
      console.log("我的", res);
      let info = res.data.result[0];
      this.nickName = info.nickName;
      this.userImg = info.userImg;
      this.userBg = info.userBg;
      this.desc = info.desc;
    });

    // this.$axios({
    //   method: "get",
    //   url: "findAccountInfo",
    //   params: {
    //     appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
    //     tokenString: this.$cookies.get("tokenString"),
    //   },
    // }).then((res) => {
    //   // console.log("个人资料",res.data.result[0]);
    //   let info = res.data.result[0];

    //   this.userImg = info.userImg;
    //   // console.log(this.value);
    // });
  },
};
</script>

<style lang="less" scoped>
.my {
  .bg {
    // width: 200px;
    height: 200px;
    position: relative;
    .van-uploader {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
     
      /deep/.van-uploader__upload {
        width: 100%;
        height: 200px;
        background-color: transparent;
        margin: 0;
        i::before {
          content: "";
        }
      }
    }
  }
  .personaldata {
    margin: 0 15px;
    padding: 0 15px;
    transform: translateY(-40px);
    // background-color: palegoldenrod;
    // background-color: #fff;
    background: rgba(255, 255, 255, 0.8);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    .person-name {
      height: 50px;
      text-align: center;
      line-height: 40px;
      font-size: 16px;
      color: #3c34ba;
      //   border-top-left-radius: 10px;
      //   border-top-right-radius: 10px;
    }
    .person-detail {
      background-color: #fff;
      display: flex;
      .head-img {
        width: 70px;
        height: 70px;
        overflow: hidden;
        border-radius: 50%;
        transform: translateY(-50%);
        margin-right: 10px;
      }
      .user-describe {
        width: 220px;
        height: 50px;
        // background-color: green;
        display: -webkit-box;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
      }
    }
    .other {
      margin-top: 40px;
      line-height: 40px;
      :nth-child(-n + 3) {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #eee;
        font-size: 14px;
      }
      .van-icon {
        line-height: 42px;
        color: #969eb3;
      }
      // .user-data {
      //   display: flex;
      //   justify-content: space-between;
      // }
      .safe {
        display: flex;
        justify-content: space-between;
      }
      .address-manage {
        // border-bottom: 0;
      }
    }
  }
}
</style>