<template>
  <div class="manage">
    <van-nav-bar
      left-text="返回"
      title="地址管理"
      left-arrow
      @click-left="gomy"
    />

    <div class="addressList">
      <!-- :switchable="false" -->
      <!-- v-model="chosenAddressId" -->
      <van-address-list
        :list="addresslist"
        @edit="onEdit"
        :switchable="false"
        default-tag-text="默认"
        @add="add"
      />
    </div>
  
  </div>
</template>

<script>
export default {
  data() {
    return {
      addresslist: [],
    };
  },
  methods: {
    gomy() {
      this.$router.go(-1);
    },
    onEdit(val) {
      this.$router.push({ name: "Address", query: val });
    },
    add() {
       this.$router.push({ name: "Address" });
    }
  },

  created() {
    this.$axios({
      method: "get",
      url: "findAddress",
      params: {
        appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
        tokenString: this.$cookies.get("tokenString"),
      },
    }).then((res) => {
      console.log("添加地址 ===》", res);
      // 如果地址里有地址就直接打开  没有的话就去向添加地址页面
      if (res.data.code == 20000 && res.data.result.length) {
        this.addresslist = [];
        console.log("res==>", res.data.result);
        for (let item of res.data.result) {
          // if (item.isDefault) this.chosenAddressId = item.id;
          let address = `${item.province}/${item.city}/${item.county}/${item.addressDetail}`;
          this.addresslist.push({
            id: item.id,
            name: item.name,
            tel: item.tel,
            address,
            isDefault: !!item.isDefault,
            aid: item.aid,
            areaCode: item.areaCode,
          });
        }
      }
    });
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      console.log(1111);
      vm.$nextTick(() => {
        vm.$axios({
          method: "get",
          url: "findAddress",
          params: {
            appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
            tokenString: vm.$cookies.get("tokenString"),
          },
        }).then((res) => {
          // console.log("添加地址 ===》", res);
          // 如果地址里有地址就直接打开  没有的话就去向添加地址页面
          if (res.data.code == 20000 && res.data.result.length) {
            vm.addresslist = [];
            // console.log("res==>", res.data.result);
            for (let item of res.data.result) {
              // if (item.isDefault) this.chosenAddressId = item.id;
              let address = `${item.province}/${item.city}/${item.county}/${item.addressDetail}`;
              vm.addresslist.push({
                id: item.id,
                name: item.name,
                tel: item.tel,
                address,
                isDefault: !!item.isDefault,
                aid: item.aid,
                areaCode: item.areaCode,
              });
            }
            console.log(vm.addresslist);
          }
        });
      });
    });
  },
};
</script>

<style lang="less" scoped>
</style>