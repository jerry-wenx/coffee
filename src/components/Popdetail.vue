<template>
  <!-- 详情弹出部分 -->
  <div class="detail">
    <!-- 头部选项部分 -->
    <van-popup
      v-model="$store.state.isShowPop"
      position="bottom"
      closeable
      @click-close-icon="closePop"
    >
      <div class="select">
        <van-tabs v-model="active">
          <van-tab title="详情">
            <div class="detail">
              <div class="img">
                <img class="auto-img" :src="detail.large_img" />
              </div>
              <p class="desc">- 餐品描述 -</p>
              <div class="text">{{ detail.desc }}</div>
              <div class="foot">
                <div class="left">
                  <p class="name one-text">
                    {{ detail.name }} <span>({{ detail.enname }})</span>
                  </p>
                  <div class="price">￥{{ detail.price }}</div>
                </div>
                <div class="right">
                  <van-button
                    @click="tospecs"
                    type="warning"
                    round
                    color="linear-gradient(to right, #ffe400, #ffc400)"
                    size="small"
                    >选择规格</van-button
                  >
                </div>
              </div>
            </div>
          </van-tab>

          <van-tab title="规格">
            <div class="specifications">
              <!-- 选择口味 -->
              <div class="flavor">
                <!-- 温度 -->
                <div class="tem" v-show="detail.tem != ''">
                  {{ detail.tem_desc }}
                  <div class="btns">
                    <van-button
                      :class="{ active: i == detail.tem_index }"
                      round
                      v-for="(item, i) in detail.tem"
                      :key="i"
                      @click="flavor('tem', i)"
                      >{{ item }}</van-button
                    >
                  </div>
                </div>

                <!-- 糖 -->
                <div class="sugar" v-show="detail.tem != ''">
                  {{ detail.sugar_desc }}
                  <div class="btns">
                    <van-button
                      :class="{ active: i == detail.sugar_index }"
                      round
                      v-for="(item, i) in detail.sugar"
                      :key="i"
                      @click="flavor('sugar', i)"
                      >{{ item }}</van-button
                    >
                  </div>
                </div>

                <!-- 奶油 -->
                <div class="cream" v-show="detail.cream != ''">
                  {{ detail.cream_desc }}
                  <div class="btns">
                    <van-button
                      :class="{ active: i == detail.cream_index }"
                      round
                      v-for="(item, i) in detail.cream"
                      :key="i"
                      @click="flavor('cream', i)"
                      >{{ item }}</van-button
                    >
                  </div>
                </div>
              </div>

              <!-- 选择数量部分 start -->
              <div class="amount">
                选择数量
                <div class="chiosenum">
                  <van-button icon="minus" size="small" round @click="reduce" />
                  <input type="text" v-model="num" @input="getnum" />
                  <van-button
                    icon="plus"
                    size="small"
                    round
                    class="add"
                    @click="plus"
                  />
                </div>
              </div>

              <!-- 选择数量部分 end -->

              <!-- 结算部分 start -->
              <div class="money">
                <div class="left">
                  <p class="name one-text">
                    {{ detail.name }} <span>({{ detail.enname }})</span>
                  </p>
                  <div class="price">￥{{ detail.price }}</div>
                </div>
                <div class="right">
                  <van-button
                    @click="addcar(detail.pid)"
                    type="warning"
                    round
                    color="linear-gradient(to right, #ffe400, #ffc400)"
                    size="small"
                    >加入购物车</van-button
                  >
                </div>
              </div>
              <!-- 结算部分 end -->
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {mapState} from "vuex";
export default {
  props: {
    detail: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      active: 0, //详情页下标 0为详情页面 1为规格页面
      num: 1,
    };
  },
  computed: {
    ...mapState(["isShowPop"]),
  },
  methods: {
    tospecs() {
      this.active = 1;
    },
    closePop() {
      this.active = 0;
      this.num = 1;
    },
    //选择口味
    flavor(item, i) {
      item = item + "_index";
      if (i == this.detail[item]) {
        return false;
      }
      this.detail[item] = i;
    },

    //加数量
    plus() {
      this.detail.num++;
      // console.log(this.detail);
      this.num++;
    },

    //减数量
    reduce() {
      this.num--;
      if (this.num < 1) {
        this.num = 1;
      }
    },

    //判断手动输入
    getnum() {
      // this.num = parseInt(this.num);
      if (this.num < 1 || this.num == "" || this.num == NaN) {
        this.num = 1;
      } else if (this.num > 99) {
        this.num = 99;
      }
    },

    //加入购物车
    addcar() {
      // console.log("加入购物车");
      let tokenString = this.$cookies.get("tokenString");
      if (!tokenString) {
        this.$router.push({ name: "Login" });
        return;
      }

      this.$store.commit("change", false);
      // console.log(this.num);
      //获取规格下标
      let temi = this.detail.tem_index;
      let sugari = this.detail.sugar_index;
      let creami = this.detail.cream_index;

      
     
      // console.log( this.detail.tem[temi] );
      // return;
      //获取商品规格
      let tem = temi.length < 0 ? '' : this.detail.tem[temi]+'/';
      let sugar = sugari.length < 0 ?  '' : this.detail.sugar[sugari]+'/';
      let cream = creami.length < 0 ?  '' : this.detail.cream[creami]+'/';
      let rules = tem + sugar + cream;
      // console.log(rules);
      for(let i = 0; i < rules.length; i++) {
        // console.log(rules[i]);
        if(rules[0] == '/') {
          rules = rules.slice(1)
        }
        else if(rules[rules.length-1] == '/' ) {
          rules = rules.slice(0, -1)
        }
      }
      console.log(rules);

      
      

      // rules = rules.slice(0, -1);
      
      // console.log(rules);
      // return;

      this.$axios({
        method: "post",
        url: "addShopcart",
        data: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          pid: this.detail.pid,
          count: this.num,
          rule: rules,
          tokenString: tokenString,
        },
      }).then((res) => {
        console.log(res);
        if (res.data.code == 3000) {
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
        }
      });
    },
  },
  watch: {
    isShowPop(val) {
      if(val) {
        this.num = 1;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.detail {
  .van-popup {
    min-height: 80vh;
    max-height: 80vh;
    border-top-right-radius: 15px;
    border-top-left-radius: 15px;
    overflow: hidden;
    overflow-y: auto;
    position: fixed;

    background-color: #fafafa;
    // background-color: ;

    // 详情样式
    .detail {
      .img {
        margin-top: 20px;
        
      }
      .desc {
        line-height: 40px;
        text-align: center;
        background-color: #fafafa;
      }
      .text {
        line-height: 16px;
        padding: 0 15px;
        font-size: 13px;
        color: #8e959f;
        margin-bottom: 60px;
        height: 95px;
        overflow-y: auto;
        // background-color: red;

      }
      .foot {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100vw;
        padding: 0 15px;
        box-sizing: border-box;
        display: flex;
        height: 60px;
        border-top: 1px solid #ddd;
        justify-content: space-between;
        align-items: center;
        .left {
        
          .name {
            margin-top: 10px;
            font-size: 16px;
            // background-color: blue;
            span {
              font-size: 14px;
            }
          }
          .price {
            margin-top: 5px;
            line-height: 20px;
            font-size: 14px;
            font-weight: bold;

            color: #626262;
          }
        }
        .right {
          width: 120px;
          button {
            width: 120px;
            margin: 0 5px;
          }
        }
      }
    }

    //规格样式
    .specifications {
      padding: 15px;

      .flavor {
        .tem,
        .sugar {
          //  height: 120px;
          line-height: 50px;
          font-size: 16px;
        }
        button {
          width: 120px;
          margin: 0 5px;
          &.active {
            background: linear-gradient(to right, #ffe400, #ffc400);
            color: #fff;
          }
        }
      }

      //数量部分
      .amount {
        display: flex;
        justify-content: space-between;
        height: 60px;
        line-height: 60px;
        margin: 50px 0;
        border-top: 1px solid #e8e8e8;
        border-bottom: 1px solid #e8e8e8;
        .chiosenum {
          display: flex;
          align-items: center;
          button {
            width: 22px;
            height: 22px;

            &.add {
              background: linear-gradient(to right, #ffe400, #ffc400);
              color: #fff;
            }
          }
          input {
            width: 30px;
            height: 22px;
            margin: 0 15px;
            text-align: center;
            border: 0;
          }
        }
      }

      //结账部分
      .money {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100vw;
        padding: 0 15px;
        box-sizing: border-box;
        display: flex;
        height: 60px;
        border-top: 1px solid #ddd;

        justify-content: space-between;
        align-items: center;
        button {
          //   padding: 0 40px;
          width: 120px;
          vertical-align: middle;
          margin: 0 5px;
          color: #000;
          background-color: #f7f7fa;
          &.active {
            background: linear-gradient(to right, #ffe400, #ffc400);
            color: #fff;
          }
        }

        .left {
          .name {
            margin-top: 10px;
            font-size: 16px;

            span {
              font-size: 14px;
            }
          }
          .price {
            margin-top: 5px;
            line-height: 20px;
            font-size: 14px;
            font-weight: bold;
            color: #626262;
          }
        }
      }
    }
  }
}
</style>