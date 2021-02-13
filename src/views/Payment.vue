<template>
  <div class="address">
    <div class="top">
      <van-nav-bar
        title="Blue Cup~"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
    </div>
    <div class="btn">
      <van-button type="default" size="large" round @click="address"
        >请添加配送地址</van-button
      >
    </div>

    <div class="info" v-if="detailads.id ? true : false">
      {{ detailads.name }} {{ detailads.address }} <br />
      {{ detailads.tel }}
      
    </div>

    <div class="billDetail">
      <div class="detailTop">
        <span>订单详情</span>
        <!-- <van-button size="normal" round @click="continueorder"
          >继续点单</van-button
        > -->
      </div>

      <div class="detaiInfo" v-for="(pro, i) in proList" :key="i">
        <van-nav-bar>
          <template #left>
            <div class="content">
              <div class="left">
                <img class="auto-img" :src="pro.small_img" />
              </div>
              <div class="right">
                <div class="top">{{ pro.name }}</div>
                <div class="bottom">{{ pro.rule }}</div>
              </div>
            </div>
          </template>
          <template #title> x{{ pro.count }} </template>

          <template #right> ￥{{ pro.count * pro.price }} </template>
        </van-nav-bar>
      </div>
    </div>

    <!-- 如果存在地址就从下放弹出 -->
    <div class="hideAddress">
      <van-popup v-model="show" closeable position="bottom">
        <div class="frist-text">请选择地址</div>
        <div class="addressList">
          <!-- :switchable="false" -->
          <van-address-list
            v-model="chosenAddressId"
            :list="list"
            default-tag-text="默认"
            @add="onAdd"
            @edit="onEdit"
            @select="select"
          />
        </div>
      </van-popup>
    </div>

    <div class="paymoney">
      <van-tabbar>
        <van-tabbar-item style="font-size: 16px">
          共计:<span>{{ num }}</span
          >件 | ￥{{ totalprice }}
        </van-tabbar-item>
        <van-tabbar-item>
          <van-button round @click="confirmPay">确认支付</van-button>
        </van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>

<script>
import "../assets/less/payment.less";
import { mapState } from "vuex";
export default {
  data() {
    return {
      show: false,
      detailads: {},
      chosenAddressId: 0, // 地址选中激活状态
      list: [],
      totalprice: 0,
      num: 0, // 商品数量
      sids: [], //sid集合
      proList: [],
      delListIndex: [],
    };
  },
  methods: {
    //切换选中地址
    select(val) {
      // console.log(val);
      this.chosenAddressId = val.id;
      this.detailads = val;
      // console.log(this.detailads);
    },

    // 确认支付
    confirmPay() {

      this.$store.commit("money", 0);
      // 确认支付就删除掉购物车是商品
      let sid = [];
      // let delListIndex = [];
      let count = 0;
      let money = 0;
      // console.log("this.prolist", this.proList);
      for (let k in this.proList) {

        sid.push(this.proList[k].sid);
       
        count += this.goodsList[k].count;
        money += this.goodsList[k].count * parseFloat(this.goodsList[k].price);
      }
      // console.log(sid);
      // return;

       this.$store.commit("delgoodsList", this.delListIndex);
      // console.log("this.sids==>", this.sids);
      // return;
      if (this.proList.length > 0) {
        // console.log("this.proList.length", this.proList.length);

        this.$axios({
          method: "post",
          url: "pay",
          data: {
            appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
            tokenString: this.$cookies.get("tokenString"),
            sids: JSON.stringify(this.sids),
            address: this.detailads.address,
            receiver: this.detailads.name,
            phone: this.detailads.tel,
          },
        }).then((res) => {
          // console.log("付款里res===>", res);
         
          // 这是删除部分
          this.$axios({
            method: "post",
            url: "deleteShopcart",
            data: {
              appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
              tokenString: this.$cookies.get("tokenString"),
              sids: JSON.stringify([sid]),
            },
          }).then((res) => {
            // console.log(res);
            console.log('delListIndex',this.delListIndex);
          
            // console.log(delListIndex,count,delListIndex);
            // this.$store.commit("delgoodsList", this.delListIndex);
            this.$store.commit("delGoodsCount", count);
            this.$store.commit("delOneNewList", this.delListIndex);
            // console.log("删除商品后的money", money);
            // this.$emit("updata", money);
           
          });
          
          // 改变购物车
          this.$store.commit("change", false);
          this.$router.push({ name: "Bill" });
        });
      } else {
        this.$toast({
          message: "没有订单",
          forbidClick: true,
          duration: 700,
        });
      }
      this.proList = [];
    },

    

    //添加地址
    address() {
      this.$axios({
        method: "get",
        url: "findAddress",
        params: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: this.$cookies.get("tokenString"),
        },
      }).then((res) => {
        // console.log("添加地址 ===》",res);
        // 如果地址里有地址就直接打开  没有的话就去向添加地址页面
        if (res.data.code == 20000 && res.data.result.length) {
          this.list = [];
          this.chosenAddressId = 0;
          // console.log("res==>",res.data.result);
          for (let item of res.data.result) {
            if (item.isDefault) this.chosenAddressId = item.id;
            let address = `${item.province}/${item.city}/${item.county}/${item.addressDetail}`;
            this.list.push({
              id: item.id,
              name: item.name,
              tel: item.tel,
              address,
              isDefault: !!item.isDefault,
              aid: item.aid,
              areaCode: item.areaCode,
            });
          }
          this.show = true;
        } else {
          this.$router.push({ name: "Address" });
        }
      });
    },
    onClickLeft() {
      this.$store.commit("money", 0);
      this.$router.push({ name: "Home" });
    },
    continueorder() {
      this.$router.push({ name: "Menu" });
    },

    //弹出层的新增地址按钮
    onAdd() {
      this.$router.push({ name: "Address" });
    },
    onEdit(val) {
      this.$router.push({ name: "Address", query: val });
    },
  },
  computed: {
    ...mapState(["goodsList"]),
    // "prolist",
  },
  // beforeRouteEnter(to, from, next) {
  //   next((vm) => {
  //     vm.$nextTick(function () {
  //       // console.log(to.query);
  //       let list = to.query;
  //       console.log(list);
  //         // console.log(item);
  //         // this.detailads = to.query
  //         // console.log(this.detailads);

  //     });
  //   });
  // },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$nextTick(() => {
        vm.show = false;
        // console.log(vm.goodsList.length);
        if (vm.goodsList.length == 0) {
          vm.$router.push({ name: "Home" });
          return;
        }

        // console.log("购物车商品", vm.goodsList);
        vm.proList = [];
        for (let i in vm.goodsList) {
          if (vm.goodsList[i].checked) {
            // console.log("要删除的商品---》",i);
            vm.delListIndex.push(i);
            vm.proList.push(vm.goodsList[i]);
          }
        }

        // return;
        // 查询地址
        vm.$axios({
          method: "get",
          url: "findAddress",
          params: {
            appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
            tokenString: vm.$cookies.get("tokenString"),
          },
        }).then((res) => {
          console.log("vm===>", vm.proList);
          // return;
          vm.num = 0;
          vm.totalprice = 0;
          vm.sids = [];
          for (let i of vm.proList) {
            vm.num += i.count;
            // console.log(i);
            vm.totalprice += i.count * i.price;
            vm.sids.push(i.sid);
          }
          // vm.shopCarCommit(vm);
          for (let address of res.data.result) {
            if (address.isDefault) {
              let detailaddress = `${address.province}/${address.city}/${address.county}/${address.addressDetail}`;
              vm.detailads = address;
              address.address = detailaddress;
              // console.log("vm.detailads===>", vm.detailads);
              // console.log(address);
              break;
            }
          }
        });
      });
    });
  },
};
</script>
