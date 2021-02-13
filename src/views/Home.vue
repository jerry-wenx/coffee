<template>
  <div class="home">
    <div class="banner">
      <van-swipe :autoplay="3000">
        <!-- @click="goDetail(item.pid)" -->
        <van-swipe-item
          v-for="(item, index) in this.urls"
          :key="index"
          @click="details(item.pid)"
        >
          <img class="auto-img" :src="item.bannerImg" />
        </van-swipe-item>
      </van-swipe>
    </div>

    <div class="choice" v-if="false">
      <div class="left">
        <em>
          <img class="auto-img" src="../assets/images/door.png" />
        </em>
        <p class="way">门店自取</p>
        <p class="intr">下单免排队</p>
      </div>
      <div class="right">
        <em>
          <img class="auto-img" src="../assets/images/take-out.png" />
        </em>
        <p class="way">外卖</p>
        <p class="intr">无接触配送,送爱到家</p>
      </div>
    </div>

    <div class="best-sellers" :style="$store.state.goodsList != '' ? 'margin-bottom: 120px' : 'margin-bottom: 50px'">
      <p class="hot-title">热卖推荐</p>
      <div class="hot-coffee">
        <div
          class="hots"
          v-for="item in hot"
          :key="item.id"
          @click="details(item.pid)"
        >
          <img class="auto-img" :src="item.largeImg" />
          <div class="name">{{ item.name }}</div>
          <div class="enname">{{ item.enname }}</div>
          <div class="price">￥{{ item.price }}</div>
        </div>
      </div>

    <Popdetail :detail="detail"></Popdetail>
    </div>
    <!-- ======== -->
  </div>
</template>

<script>
import "../assets/less/home.less";
import Popdetail from "../components/Popdetail.vue";
export default {
  name: "Home",
  components: { Popdetail },
  data() {
    return {
      urls: [],
      hot: [],
      current: 0,
      id: Number,
      detail: {},
    };
  },
  methods: {
    //点击获取商品详情信息
    details(id) {
      this.$store.commit("change", true);
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
        if (res.data.code == 600) {
          res.data.result[0].tem = res.data.result[0].tem.split("/");
          res.data.result[0].sugar = res.data.result[0].sugar.split("/");
          res.data.result[0].cream = res.data.result[0].cream.split("/");
          res.data.result[0].tem_index = 0;
          res.data.result[0].sugar_index = 0;
          res.data.result[0].cream_index = 0;
           res.data.result[0].num = 1
          this.detail = res.data.result[0];
          // console.log(this.detail);
        }
      });
    },
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$axios({
        methods: "get",
        url: "banner",
        params: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
        },
      }).then((data) => {
        // console.log(data);
        vm.urls = data.data.result;
        // console.log(vm.urls);
      });

      //热卖推荐
      vm.$axios({
        methods: "get",
        url: "typeProducts",
        params: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          key: "isHot",
          value: 1,
        },
      }).then((data) => {
        vm.hot = data.data.result;
      });
    });
  },

 

};
</script>




