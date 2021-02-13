<template>
  <!-- 购物车 -->
  <div class="shopcar" @click="examine" disabled>
    <div class="left">
      <van-badge :content="goodsCount == 0 ? '' : goodsCount" max="99">
        <div class="img">
          <img class="auto-img" :src="isEdit ? del : car" />
        </div>
      </van-badge>
      <span class="money">￥{{ Money }}</span>
    </div>
    <div class="right">
      <van-button round @click.stop="nextsometing" color="">{{
        isEdit ? "删除" : "下一步"
      }}</van-button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "ShopCar",
  data() {
    return {
      del: require("../assets/images/Delete.png"),
      car: require("../assets/images/外卖.png"),
    };
  },
  methods: {
    examine() {
      //显示购物车的条件
      // console.log(this.isShowCar);
       


      this.$store.commit("changeisShowCar", true);
      // console.log("this.newList===>", this.newList);
      if (this.newList.length < 5) {
        // console.log("小于五");
        let arr = this.goodsList.slice(0, 5);
        this.$store.commit("addNewList", "");
        // console.log("arr===>",arr);
        this.$store.commit("addNewList", arr);
      }
    },
    nextsometing() {
      if (this.isEdit) {
        // console.log("删除");
        let sid = [];
        let delListIndex = [];
        let count = 0;
        let money = 0;
        for (let i in this.goodsList) {
          if (this.goodsList[i].checked) {
            delListIndex.push(i);
            sid.push(this.goodsList[i].sid);
            count += this.goodsList[i].count;
            money +=
            this.goodsList[i].count * parseFloat(this.goodsList[i].price);
          }
        }
        
        this.$axios({
          method: "post",
          url: "deleteShopcart",
          data: {
            appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
            tokenString: this.$cookies.get("tokenString"),
            sids: JSON.stringify([sid]),
          },
        }).then(() => {
          // console.log(res);

          this.$store.commit("delgoodsList", delListIndex);
          this.$store.commit("delGoodsCount", count);
          this.$store.commit("delOneNewList", delListIndex);
          this.$store.commit("money", 0);
          // this.$emit("updataem", 0);
          this.$emit("updataem", money);
          if(this.goodsList.length == 0 ) {
             this.$store.commit("changeisShowCar", false);
          }
        });
      } else {
        // 下一步
        if (this.goodsList.length == 0) {
          this.isChioes = false;
        }
        this.$store.commit("change", false);
        if (this.newList.length < 5) {
          // console.log("小于五");
          let arr = this.goodsList.slice(0, 5);
          this.$store.commit("addNewList", "");
          this.$store.commit("addNewList", arr);
        }
        this.$store.commit("changeisShowCar", true);

        var arr = [];
        for (let item of this.goodsList) {
          if (item.checked) {
            arr.push(item);
          }
        }

        // 如果arr长度不为零就跳转
        if (arr.length > 0 || this.$store.state.prolist.length > 0) {
          this.$router.push({ name: "Payment" });
          // this.$store.commit("chprolist", arr);   //更改下单列表的
          this.$store.commit("changeisShowCar", false);
          // console.log(this.goodsList);
          let sid = [];
          let delListIndex = [];
          let count = 0;
          let money = 0;
          for (let i in this.goodsList) {
            if (this.goodsList[i].checked) {
              delListIndex.push(i);
              sid.push(this.goodsList[i].sid);
              count += this.goodsList[i].count;
              money +=
                this.goodsList[i].count * parseFloat(this.goodsList[i].price);
            }
          }
          // this.$emit("updataem", money);
        }

        // 如果没有商品
        else {
          this.$toast({
            message: "请勾选商品",
            forbidClick: true,
            duration: 200,
          });
        }
      }
    },
  },
  computed: {
    ...mapState([
      "goodsCount",
      "goodsList",
      "newList",
      "numbers",
      "isShowCar",
      "isEdit",
      "Money",
    ]),
  },
};
</script>

<style lang="less" scoped>
.shopcar {
  width: 100%;
  height: 50px;
  position: fixed;
  bottom: 50px;
  left: 0;
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  box-shadow: 0 0 1px #000;
  padding: 10px 0;
  // padding: 0 15px;
  .left {
    margin-left: 15px;
    // width: 150px;
    display: flex;

    // background-color: green;
    .img {
      width: 30px;
      height: 30px;
      margin: 10px auto;
    }
    .money {
      margin-left: 10px;
      font-size: 16px;
      line-height: 50px;
      color: #4a4a4a;
    }
  }
  .right {
    margin-right: 15px;
    // background-color: purple;
    button {
      width: 120px;
      background: linear-gradient(to right, #ffe400, #ffc400);
      color: #fff;
    }
  }
}
</style>