<template>
  <div class="bottom-nav">
    <Car
      v-show="
        ($store.state.goodsList != '' || $store.state.prolist != '') &&
        $route.meta.isshow == true
      "
    />

    <!-- 购物车订单 -->
    <van-popup
      class="detailOrder"
      v-model="$store.state.isShowCar"
      closeable
      close-icon="close"
      position="bottom"
    >
      <p class="carbag">购物袋</p>
      <div class="detailNum">
        <div class="left">
          已选中餐品: <span class="nums">{{ checkGoods }}</span
          >份
          <!-- =-=======================全选 和 清空 ====================-->
          <span class="all" @click="AllAndNotall" v-if="goodsList != ''">{{
            isChioes ? "取消全选" : "全选"
          }}</span>
          &nbsp;
          <span class="del" @click="delAll" v-if="goodsList != ''">清空</span>
        </div>
        <div class="right" v-if="goodsList != ''" @click="edit">
          {{ $store.state.isEdit ? "取消" : "编辑" }}
        </div>
      </div>

      <!--============ 购物车商品列表=============== -->
      <div class="shoplist">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了..."
          @load="onLoad"
        >
          <van-swipe-cell class="goods" v-for="(item, i) in newList" :key="i">
            <template #default>
              <!-- 左侧内容 -->
              <div class="proDetail">
                <div class="left">
                  <van-checkbox
                    v-model="item.checked"
                    @click.stop="onechioes(i)"
                  ></van-checkbox>
                  <div class="picture">
                    <img class="auto-img" :src="item.small_img" />
                  </div>
                  <div class="text one-text">
                    <p class="name">{{ item.name }}</p>
                    <p class="order">{{ item.rule }}</p>
                  </div>
                  <div class="price">￥{{ item.price }}</div>
                </div>

                <!-- =========================加减按钮功能========================== -->
                <div class="plusAndreduce">
                  <van-stepper
                    v-model="item.count"
                    theme="round"
                    button-size="22"
                    disable-input
                    catchtap="onChange"
                    @plus="plus(item.sid, i)"
                    @minus="mnius(item.sid, i)"
                  />
                </div>
              </div>
            </template>
            <template #right class="delbtn">
              <van-button
                square
                text="删除"
                type="danger"
                class="delete-button"
                @click="Delproduce(item.sid, i)"
              />
            </template>
          </van-swipe-cell>
        </van-list>
      </div>
      <Car @updataem="updatas" />
      <div class="carfood"></div>
    </van-popup>

    <van-tabbar v-model="active" route>
      <van-tabbar-item
        v-for="(item, index) in btminfo"
        :key="index"
        :to="item.to"
      >
        <van-tabbar-item>{{ item.title }}</van-tabbar-item>
        <template #icon="props">
          <img :src="props.active ? item.icon.active : item.icon.inactive" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import Car from "./ShopCar";
import { mapState } from "vuex";
export default {
  components: { Car },

  data() {
    return {
      active: 0, //激活底部图片的下标
      loading: false,
      finished: false,
      isChioes: false, //控制是否全选
      list: [],
      price: 0,
      checkGoods: 0,
      btminfo: [
        {
          title: "首页",
          icon: {
            active: require("../assets/images/home-active.png"),
            inactive: require("../assets/images/home.png"),
          },
          to: "/",
        },
        {
          title: "点单",
          icon: {
            active: require("../assets/images/menu-active.png"),
            inactive: require("../assets/images/menu.png"),
          },
          to: "/menu",
        },
        {
          title: "订单",
          icon: {
            active: require("../assets/images/bill-active.png"),
            inactive: require("../assets/images/bill.png"),
          },
          to: "/bill",
        },
        {
          title: "我的",
          icon: {
            active: require("../assets/images/my-active.png"),
            inactive: require("../assets/images/my.png"),
          },
          to: "/my",
        },
      ],
    };
  },
  methods: {
    updatas(money) {
      console.log(this.isChioes);
      console.log(this.goodsList);
      if(this.goodsList.length == 0) {
        this.isChioes = false;
      }
      this.checkGoods = 0;
       this.$store.commit("money", 0);
    },

    //清空所有
    delAll() {
      this.checkGoods = 0;
      this.isChioes = false;
      for (let key of this.goodsList) {
        this.$store.commit("addsids", key.sid);
      }

      this.$axios({
        method: "post",
        url: "deleteShopcart",
        data: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: this.$cookies.get("tokenString"),
          sids: JSON.stringify([this.sids]),
        },
      }).then(() => {
        this.$store.commit("addgoodsList", "");
        this.$store.commit("changeGoodsCount", 0);
        this.$store.commit("delAllNewList");
        this.$store.commit("money", 0);
      });
    },

    //全选或者全不选
    AllAndNotall() {
      this.isChioes = !this.isChioes;
      for (let k of this.goodsList) {
        k.checked = this.isChioes;
      }
      if (this.isChioes) {
        this.price = 0;
        for (let i = 0; i < this.goodsList.length; i++) {
          this.price += this.goodsList[i].count * this.goodsList[i].price;
        }
        // console.log(this.price);
      } else {
        this.price = 0;
      }
      this.getCheckedGoods();
    },
    //商品单选
    onechioes(index) {
      this.Moneies(index);
      this.getCheckedGoods();
      // 判断全选按钮状态

      for (let item of this.goodsList) {
        if (!item.checked) {
          this.isChioes = false;
          return;
        }
        this.isChioes = true;
      }
    },

    // 获取已经勾选的商品
    getCheckedGoods() {
      this.checkGoods = 0;
      // let money = 0;
      // console.log(this.goodsList);
      for (let i = 0; i < this.goodsList.length; i++) {
        if (this.goodsList[i].checked) {
          this.checkGoods += this.goodsList[i].count;
        }
      }
      // this.$store.commit("money", money);
    },

    // 计算价格
    Moneies(i) {
      this.price = 0;
      console.log("price==>前", this.price);
      if (this.goodsList[i].checked) {
        this.price += this.goodsList[i].price * this.goodsList[i].count;
      } else {
        this.price -= this.goodsList[i].price * this.goodsList[i].count;
      }
      this.price = this.price < 0 ? 0 : this.price;
      console.log("price==>后", this.price);
    },

    edit() {
      this.$store.commit("changeEdit", !this.$store.state.isEdit);
      // console.log(this.$store.state.isShowCar);
    },

    //加===========
    plus(key, i) {
      this.$axios({
        method: "post",
        url: "modifyShopcartCount",
        data: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: this.$cookies.get("tokenString"),
          sid: key,
          count: this.goodsList[i].count + 1,
        },
      }).then((res) => {
        if (res.data.code == 6000) {
          // console.log(this.goodsList);
          this.$store.commit("plusreduceCount", 1);
          if (this.goodsList[i].checked) {
            this.price += parseFloat(this.goodsList[i].price);
            // console.log(this.price);
          }
        }
      });
    },
    //减===========
    mnius(key, i) {
      this.$axios({
        method: "post",
        url: "modifyShopcartCount",
        data: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: this.$cookies.get("tokenString"),
          sid: key,
          count: this.goodsList[i].count - 1,
        },
      }).then((res) => {
        if (res.data.code == 6000) {
          this.$store.commit("plusreduceCount", 0);
          if (this.goodsList[i].checked) {
            this.price -= parseFloat(this.goodsList[i].price);
          }
        }
      });
    },

    // 删除商品
    Delproduce(sid, i) {
      this.$store.commit("addsids", sid);
      this.$axios({
        method: "post",
        url: "deleteShopcart",
        data: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: this.$cookies.get("tokenString"),
          sids: JSON.stringify([sid]),
        },
      }).then((res) => {
        // console.log("删除里面的-->", this.goodsList[i]);
        if (this.goodsList[i].checked) {
          this.price -= this.goodsList[i].price * this.goodsList[i].count;
          this.checkGoods -= this.goodsList[i].count;
        }
        let count = this.goodsList[i].count;
        this.$store.commit("delgoodsList", i);
        this.$store.commit("delGoodsCount", count);
        this.$store.commit("delOneNewList", i);
        if (this.goodsList == "") {
          this.isChioes = false;
        }
        if (this.goodsList.length == 0) {
          this.price = 0;
          return;
        }
        this.getCheckedGoods();
      });
    },

    onLoad() {
      // 加载状态结束

      if (this.goodsList.length < 5) {
        this.finished = true;
        return;
      }

      this.loading = false;
      this.$store.commit("plusnum", 1);
      // console.log(this.numbers - 1);
      let arr = this.goodsList.slice((this.numbers - 1) * 5, this.numbers * 5);
      // console.log("加载数据");
      // console.log("onload", arr);
      this.$store.commit("addNewList", arr);
      if (this.goodsList.length < this.numbers * 5) {
        this.finished = true;
        return;
      }
    },
  },

  created() {
    // console.log(1111);
    // 购物车提交订单页面查询需要购买商品
    // shopCarCommit(vm) {
    //   // console.log("vm-sid ===>", vm.sids);

    if (!this.$cookies.get("tokenString")) return;
    this.$axios({
      methods: "get",
      url: "findAllShopcart",
      params: {
        appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
        tokenString: this.$cookies.get("tokenString"),
      },
    }).then((res) => {
      let count = 0;
      for (let k of res.data.result) {
        k.checked = false;
        count += k.count;
      }

      this.$store.commit("addgoodsList", res.data.result);
      this.$store.commit("changeGoodsCount", count);
    });

    //  console.log(this.Money,"bottomNav");
    this.price = this.Money;
    //  console.log("htis.money", this.Money, "this.price",this.price);

    if (this.goodsList.length == 0) {
      this.$store.commit("money", 0);
      return;
    }
    let m = 0;
    for (let v of this.goodsList) {
      console.log(v);
      if (v.checked) {
        m += v.count * v.price;
      }
    }
    m = 0;
    this.$store.commit("money", m);
  },

  computed: {
    ...mapState([
      "goodsList",
      "sids",
      "goodsCount",
      "newList",
      "numbers",
      "isShowCar",
      "Money",
    ]),
  },
  watch: {
    isShowCar() {
      if (!this.$store.state.isShowCar) {
        this.$store.commit("changeEdit", false);
      }
    },
    price(val) {
      // console.log("bottomNav--price------>val",val);
      this.$store.commit("money", val);
    },
  },
};
</script>





<style lang="less" scoped>
.bottom-nav {
  .detailOrder {
    // position: relative;
    // height: 60vh;
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 80vh;
    max-height: 80vh;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    .shopcar {
      bottom: 0;
    }
    .carbag {
      // left: 50px;

      padding: 0 15px;
      box-sizing: border-box;
      line-height: 55px;
      font-size: 18px;
      border-bottom: 1px solid #ddd;
      color: #1d1d26;
    }
    .detailNum {
      padding: 0 15px;
      box-sizing: border-box;
      line-height: 30px;
      font-size: 16px;
      display: flex;
      justify-content: space-between;
      // margin-bottom: 15px;
      .left {
        .all {
          font-size: 14px;
          color: #0c34ba;
        }
        .del {
          margin-left: 5px;
          font-size: 14px;
          color: #8e959f;
        }
        .check {
          margin-left: 5px;
          font-size: 14px;
        }
      }
    }
    .shoplist {
      height: 60px;
      flex: 1;
      overflow: hidden;
      overflow-y: auto;
      // background-color: green;
      padding-bottom: 70px;

      .goods {
        /deep/ .van-swipe-cell__right {
          display: flex;
          align-items: center;
        }

        .proDetail {
          height: 80px;
          padding: 0 15px;
          width: 100%;
          box-sizing: border-box;
          // background-color: pink;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .left {
            // flex: 1;
            // width: 500px;
            display: flex;
            height: 100%;
            align-items: center;
            // background-color: blue;
            .picture {
              margin-left: 10px;
              width: 30px;
              height: 30px;
              // height: 50px;
              border-radius: 50%;
              overflow: hidden;
            }
            .text {
              margin-left: 7px;
              width: 120px;
              // padding-left: 15px;

              display: flex;
              flex-direction: column;
              .name {
                margin-top: 20px;
                font-size: 14px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;

                // margin-bottom: 5px;
              }
              .order {
                margin-top: 2px;
                color: #9c9c9c;
              }
            }
          }

          .plusAndreduce {
            // background-color: red;
            // margin-left: 150px;
            /deep/ .van-stepper__minus {
              border-color: #999;
              color: #000;
            }
            /deep/ .van-stepper__plus {
              background: linear-gradient(to right, #ffe400, #ffc400);
            }
          }
        }
      }
    }
  }
}
</style>

