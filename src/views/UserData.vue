<template>
  <div class="userdata">
    <van-nav-bar
      left-text="返回"
      title="个人资料"
      left-arrow
      @click-left="gomy"
    />

    <div class="select">
      <div class="se-box">
        <div class="img">
          头像
          <van-uploader
            :after-read="afterRead"
            :max-count="1"
            :max-size="500 * 1024"
            accept="image/png,image/jpg,image/jpeg"
          />
          <img :src="value.userImg" />
        </div>

        <van-field v-model="value.nickName" blur="changeName" label="用户名" />
        <van-field v-model="value.userId" disabled label="用户id" />
        <van-field v-model="value.phone" disabled label="手机号" />
        <van-field
          v-model="value.desc"
          label="描述"
          :placeholder="value.desc ? value.desc : '这家伙很懒什么都没有留下'"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo: [],
      value: {
        nickName: "",
        userId: "",
        phone: "",
        desc: "",
        userImg: "",
      },
      obj: {},
    };
  },
  methods: {
    gomy() {
      // // 判断用户是否更改的信息
      let newname = this.value.nickName === this.obj.nickName;
      // let userImg = this.value.userImg === this.obj.userImg;
      let desc = this.value.desc === this.obj.desc;

      if (!newname) {
        // console.log(this.value.nickName);
        if(this.value.nickName.length > 10) {
          this.$toast({
            message: '用户名过长（1-10位）',
            forbidClick: true,
            duration: 500,
          });
          return;
        }
        this.changeName(this.value.nickName);
      }
      if(!desc) {
        this.changeDesc(this.value.desc);
      }

      this.$router.go(-1);
    },
       changeDesc(v) {
      let desc = v;
      // console.log(v);
      this.axios({
        //请求方式
        method: "POST",
        url: "updateDesc",
        data: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: this.$cookies.get("tokenString"),
          desc,
        },
      }).then((res) => {
        if (res.data.code == "C001") {
          this.$toast({
            message: '修改成功',
            forbidClick: true,
            duration: 500,
          });
        }
      });
    },
    changeName(v) {
      let nickName = v;
      // console.log(v);
      this.axios({
        //请求方式
        method: "POST",
        url: "updateNickName",
        data: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: this.$cookies.get("tokenString"),
          nickName,
        },
      }).then((res) => {
        if (res.data.code == "C001") {
          this.$toast({
            message: '修改成功',
            forbidClick: true,
            duration: 500,
          });
        }
      });
    },

    // 上传头像
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
        url: "updateAvatar",
        data: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: tokenString,
          imgType: type,
          serverBase64Img: base64,
        },
      }).then((res) => {
        // console.log(res);

        if (res.data.code === "H001") {
          if (res.data.result[0] === 1) {
            console.log(res.data.userImg);
            this.value.userImg = res.data.userImg;
            console.log(this.value);
          }
        }
      });
    },
  },

  created() {
    this.$axios({
      method: "get",
      url: "findAccountInfo",
      params: {
        appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
        tokenString: this.$cookies.get("tokenString"),
      },
    }).then((res) => {
      // console.log("个人资料",res.data.result[0]);
      let info = res.data.result[0];
      this.userInfo = res.data.result[0];
      // console.log(info);
      this.value.nickName = info.nickName;
      this.value.userId = info.userId;
      this.value.phone = info.phone;
      this.value.desc = info.desc;
      this.value.userImg = info.userImg;
      // console.log(this.value);
      //复制一份对比组
      this.obj = { ...this.value };
    });
  },
};
</script>


<style lang="less" scoped>
.userdata {
  .select {
    padding: 0 15px;
  }
  .se-box {
    background-color: #fff;
    margin-top: 20px;
    padding-top: 15px;
    padding-bottom: 8px;
    border-radius: 10px;
    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 45px;
      padding: 0 15px;
      // border-bottom: 1px solid rgb(230, 226, 226);
      font-size: 14px;
    }

    .img {
      // background-color: red;
      .van-uploader {
        width: 30px;
        height: 30px;
        transform: translateX(145px);
        border-radius: 50%;
        overflow: hidden;
        /deep/.van-uploader__upload {
          width: 30px;
          background-color: transparent;
          height: 30px;
          margin: 0;
          i::before {
            content: "";
          }
        }
      }
      img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        overflow: hidden;
      }
    }
    .detail {
      border: none;
    }
    .one-text {
      text-align: right;
      width: 200px;
    }
    /deep/.van-cell {
      .van-field__control {
        text-align: right;
        color: #9e989c;
      }
    }
  }
}
</style>
