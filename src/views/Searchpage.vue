<template>
  <div class="search-page">
    <van-nav-bar
      left-text="返回"
      title="blue cup~"
      left-arrow
      @click-left="gomy"
    />

    <div class="search-box">
      <form action="/">
        <van-search
          v-model="value"
          show-action
          @clear="clears"
          placeholder="请输入搜索关键词"
          @input="input"
          @cancel="onCancel"
          autofocus="true"
        />
      </form>
    </div>

    <div class="prolist">
      <div
        class="pro"
        v-for="v of prolist"
        :key="v.pid"
        @click="details(v.pid)"
      >
        <div class="left">
          <div class="img">
            <img class="auto-img" :src="v.smallImg" />
          </div>
          <div class="name">{{ v.name }}</div>
        </div>

        <div class="right">
          ￥<span>{{ v.price }}</span>
        </div>
      </div>

      <van-empty
        v-show="show"
        class="custom-image"
        image="https://img01.yzcdn.cn/vant/custom-empty-image.png"
        description="啊哦！ 没有找到你想要的"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: "",
      timer: null,
      prolist: [],
      show: false,
      detailInfo: {},
    };
  },
  methods: {
    gomy() {
      this.$router.go(-1);
    },
    input(val) {
      if (val == "") {
        this.show = false;
        return;
      }

      clearTimeout(this.timer);
      this.timer = null;
      this.timer = setTimeout(() => {
        this.$axios({
          method: "get",
          url: "search",
          params: {
            appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
            name: val,
          },
        }).then((res) => {
          console.log(res);

          this.prolist = res.data.result;
          if (res.data.result.length == 0) {
            this.show = true;
          }
        });
      }, 200);
    },
    onCancel() {
      this.prolist = [];
      this.show = false;
    },
    clears() {
      this.prolist = [];
      this.show = false;
    },

    details(id) {
      this.prolist = [];
      this.value = "";
      this.show = false;
      this.$store.commit("change", true);
      // console.log(id);
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      //详情数据
      this.$axios({
        methods: "get",
        url: "productDetail",
        params: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          pid: id,
        },
      }).then((res) => {
        // console.log(res);
        this.$toast.clear();
        // return;
        if (res.data.code == 600) {
          res.data.result[0].tem = res.data.result[0].tem.split("/");
          res.data.result[0].sugar = res.data.result[0].sugar.split("/");
          res.data.result[0].cream = res.data.result[0].cream.split("/");
          res.data.result[0].tem_index = 0;
          res.data.result[0].sugar_index = 0;
          res.data.result[0].cream_index = 0;
          res.data.result[0].num = 1;
          this.detailInfo = res.data.result[0];
          // console.log("this.detailInfo", this.detailInfo);

          this.$router.push({ name: 'Menu', params: { info: this.detailInfo }})

        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.search-page {
  .prolist {
    margin-top: 10px;
    .pro {
      margin: 5px 0;
      background-color: #fff;
      padding: 0 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left {
        display: flex;
        align-items: center;
        // background-color: red;
        .img {
          width: 50px;
          height: 50px;
        }
        .name {
          margin-left: 15px;
          font-size: 14px;
        }
      }
      .right {
        // background-color: green;
      }
    }
  }
}
</style>