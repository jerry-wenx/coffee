<template>
  <div class="bill">
    <div class="select">
      <van-button
        type="default"
        round
        @click="current"
        :class="{ current: active == 1 }"
        >当前订单</van-button
      >
      <van-button
        type="default"
        round
        @click="history"
        :class="{ current: active == 2 }"
        >历史订单</van-button
      >
    </div>
    <!-- 当前订单 -->
    <div class="currentorder" v-show="active == 1">
      <div class="item" v-for="(v, i) in orderList" :key="v.oid">
        <div class="order-num">
          <div class="num">{{ v.oid }}</div>
          <div class="confirm-receipt" @click="confirm(v.oid, i)">确认收货</div>
        </div>
        <div class="prodetail" v-for="item in v.data" :key="item.id">
          <div class="pro-left">
            <img class="auto-img" :src="item.smallImg" />
          </div>
          <div class="pro-right">
            <div class="top one-text">{{ item.name }}</div>
            <div class="middle one-text">{{ item.enname }}</div>
            <div class="bottom">
              <div class="price">￥{{ item.price }}</div>
              <div class="num">x{{ item.count }}</div>
            </div>
          </div>
        </div>
        <div class="time">
          {{ v.proInfo.date | formatDate("yyyy-MM-dd hh:mm:ss") }}
          <div class="toatl">总计: ￥{{ v.proInfo.total }}</div>
        </div>
      </div>
    </div>

    <!-- 历史订单 -->
    
    <div class="historyorder" v-show="active == 2">

      <div class="item" v-for="(v, i) in orderList" :key="v.oid">
        <div class="order-num">
          <div class="num">{{ v.oid }}</div>
          <div class="confirm-receipt" @click="delorder(v.oid, i)">
            删除订单
          </div>
        </div>
        <div class="prodetail" v-for="item in v.data" :key="item.id">
          <div class="pro-left">
            <img class="auto-img" :src="item.smallImg" />
          </div>
          <div class="pro-right">
            <div class="top one-text">{{ item.name }} {{item.rule}}</div>
            <div class="middle one-text">{{ item.enname }}</div>
            <div class="bottom">
              <div class="price">￥{{ item.price }}</div>
              <div class="num">x{{ item.count }}</div> 
            </div>
          </div>
        </div>
        <div class="time">
          {{ v.proInfo.date | formatDate("yyyy-MM-dd hh:mm:ss") }}
          <div class="toatl">总计: ￥{{ v.proInfo.total }}</div>
        </div>
      </div>
    </div>
   
    <div class="empty" v-show="orderList.length == 0">
      <van-empty description="当前还没有订单哦，快去点份美食吧">
        <van-button round type="danger" class="bottom-button" @click="gomenu"
          >去点单</van-button
        >
      </van-empty>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 1,
      orderList: [],
    };
  },
  methods: {
    current() {
      this.active = 1;
      this.getOrderList(1);
    },
    history() {
      this.active = 2;
      this.getOrderList(2);
    },
    confirm(oid, i) {
      this.$axios({
        method: "post",
        url: "receive",
        data: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: this.$cookies.get("tokenString"),
          oid,
        },
      }).then((res) => {
        console.log(res);
        if (res.data.code == 80000) {
          this.orderList.splice(i, 1);
        }
      });
    },
    delorder(oid, i) {
      this.$axios({
        method: "post",
        url: "removeOrder",
        data: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: this.$cookies.get("tokenString"),
          oid,
        },
      }).then((res) => {
        console.log(res);
        if (res.data.code == 90000) {
          this.orderList.splice(i, 1);
        }
      });
    },

    // 获取订单
    getOrderList(status) {
      // console.log(11111);
      (this.orderList = []),
        this.$axios({
          method: "get",
          url: "findOrder",
          params: {
            appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
            tokenString: this.$cookies.get("tokenString"),
            status,
          },
        }).then((res) => {
          // console.log(res);
          let products = [];

          let oids = [];

          //先找oid
          res.data.result.forEach((v) => {
            v.small_img = v.smallImg;
            if (oids.indexOf(v.oid) === -1) {
              let o = {
                oid: v.oid,
                status: v.status,
                proInfo: {
                  date: v.updatedAt,
                  count: 0,
                  total: 0,
                },
                data: [],
              };
              oids.push(v.oid);
              products.push(o);
            }
          });

          //通过oid查找相应的订单商品
          products.forEach((value) => {
            res.data.result.forEach((item) => {
              if (value.oid === item.oid) {
                value.data.push(item);
                value.proInfo.count += item.count;
                value.proInfo.total += item.count * item.price;
              }
            });
          });

          // console.log('oids ==> ', oids);
          // console.log("products ==> ", products);
          this.orderList = products;
          this.orderList = this.orderList.reverse();
          console.log(this.orderList);
        });
    },

    // 去点单
    gomenu() {
      this.$router.push({ name: "Menu" });
    },
  },

  created() {
    if (!this.$cookies.get("tokenString")) {
      this.$router.push({ name: "Login" });
      return;
    }

    this.getOrderList(1);
  },
};
</script>







<style lang="less" scoped>
.bill {
  padding: 10px 15px;
  .select {
    //   background-color: #fff;
    height: 50px;
    display: flex;
    justify-content: space-between;
    .van-button--default {
      width: 47%;

      &:first-child {
        color: #9b9b9b;
        background-color: #e9e3e3;
      }
      &:last-child {
        color: #9b9b9b;
        background-color: #e9e3e3;
      }
      &.current {
        color: #fff;
        background-color: #ffbd00;
      }
    }
  }

  //当前订单样式
  .currentorder,
  .historyorder {
    margin-top: 20px;
    // background-color: #fff;
    // height: 300px;

    border-radius: 10px;
    color: #6c677e;
    .item {
      padding: 10px;
      background-color: #fff;
      border-radius: 10px;
      margin-top: 20px;
      .order-num {
        display: flex;
        justify-content: space-between;
        line-height: 20px;
        font-size: 16px;
        margin-bottom: 8px;
      }
      .prodetail {
        display: flex;
        margin: 10px 0;
        .pro-left {
          width: 70px;
          height: 70px;
        }
        .pro-right {
          padding-left: 10px;
          flex: 1;
          .one-text {
            width: 220px;
          }
          // background-color: red;
          .top {
            font-size: 14px;
          }
          .middle {
            margin-top: 5px;
            margin-bottom: 10px;
          }
          .bottom {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            .price {
              color: #0c34ba;
              font-weight: bold;
            }
          }
        }
      }
      .time {
        padding: 10px 0;
        display: flex;
        justify-content: space-between;
        // background-color: red;
      }
    }
  }

  // 没有订单显示的状态
  .empty {
    .bottom-button {
      width: 160px;
      height: 40px;
    }
  }
}
</style>