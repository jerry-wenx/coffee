<template>
  <div class="menu">
    <div class="head">
      <div class="icon" @click="search">
        <img class="auto-img" src="../assets/images/search.png" />
      </div>
      <p>Blue Cup~</p>
    </div>

    <div class="goods">
      <van-tabs v-model="active" animated @change="toggle">
        <van-tab v-for="(index, k) in list" :title="index.typeDesc" :key="k">
          <div
            class="produces"
            :style="
              $store.state.goodsList != ''
                ? 'margin-bottom: 120px'
                : 'margin-bottom: 50px'
            "
          >
            <div class="coffee">
              <div
                class="coffee-box"
                :class="{hot : item.isHot}"
                v-for="item in products"
                :key="item.id"
                @click="details(item.pid)"
              >
                <img class="auto-img" :src="item.largeImg" />
                <div class="name">{{ item.name }}</div>
                <div class="enname">{{ item.enname }}</div>
                <div class="price">￥{{ item.price }}</div>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
     <Popdetail :detail="detail"></Popdetail>
    </div>

  </div>
</template>

<script>
import "../assets/less/menu.less";
import Popdetail from "../components/Popdetail.vue";
export default {
    components: { Popdetail },
  data() {
    return {
      active: 0,
      list: [],
      products: [],
      detail: {},
    };
  },

  methods: {
    //搜索
    search(){
      // console.log('搜索');
      this.$router.push({name: 'Searchpage'});
    },


    toggle(name) {
    //   console.log(this.list[name].type);
      let types = this.list[name].type;

      this.$axios({
        methods: "get",
        url: "typeProducts",
        params: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          key: "type",
          value: types,
        },
      }).then((data) => {
        // console.log(data);
        this.products = data.data.result;
      });
    },
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
          console.log(this.detail);
        }
      });
    },
  },

  created() {
    this.$axios({
      methods: "get",
      url: "type",
      params: {
        appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
      },
    }).then((result) => {
      // console.log(result);
      this.list = result.data.result;

      // console.log(this.list);

      // 请求第一个菜单里的数据
      this.$axios({
        methods: "get",
        url: "typeProducts",
        params: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          key: "type",
          value: this.list[0].type,
        },
      }).then((data) => {
        // console.log("data ==>", data);
        this.products = data.data.result;
      });
    });
  },

  beforeRouteEnter(to, from, next){
    // console.log("from===>",from);
    next(vm => {
      let info = vm.$route.params.info
      console.log(info);
      if(info) {
        vm.detail = info
      }
    });
  }

  
};
</script>
