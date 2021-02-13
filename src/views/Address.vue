<template>
  <div class="address">
    <div class="top">
      <van-nav-bar
        :title="area.id ? '编辑地址' : '新增地址'"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
      <!-- 
        @click-right="onClickRight" -->
    </div>

    <div class="add-address">
      <!-- :disable-area="editaddress.id ? true : false " -->
      <van-address-edit
        :show-delete="area.id ? true : false"
        :area-list="areaList"
        show-set-default
        show-search-result
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="onSave"
        @delete="onDelete"
        @change-detail="onChangeDetail"
        :address-info="area"
      />
      <!-- @change-area="xiugaiarea" -->
    </div>
  </div>
</template>

<script>
import "../assets/less/address.less";
import areaList from "../assets/area";
export default {
  data() {
    return {
      areaList,
      editaddress: [],
      area: {
        id: "",
        name: "",
        tel: "",
        province: "",
        city: "",
        county: "",
        addressDetail: "",
        isDefault: "",
      },
      contrastObj: {}
    };
  },
  methods: {
    xiugaiarea(val) {
      console.log(val);
      this.area.province = val[0].name;
      this.area.addressDetail =
        val[0].name + "/" + val[1].name + "/" + val[2].name;
    },

    //新增地址
    add(val) {
      // return;
      if (val.addressDetail.length > 40) {
        this.$toast({
          message: "文本信息过长 长度应在40位之间",
          forbidClick: true,
          duration: 500,
        });
        return;
      }
      val.isDefault = val.isDefault ? 1 : 0;
      delete val.country;
      let data = {
        appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
        tokenString: this.$cookies.get("tokenString"),
        ...val,
      };

      this.$axios({
        method: "post",
        url: "addAddress",
        data,
      }).then((res) => {
        // console.log(res);
        this.$toast({
          message: res.msg,
          forbidClick: true,
          duration: 500,
        });
      });
      this.$router.push({ name: "Payment" });
    
    },
    edit(val) {
      // console.log("编辑===》", val);
      // return;
      if (val.addressDetail.length > 40) {
        this.$toast({
          message: "文本信息过长 长度应在40位之间",
          forbidClick: true,
          duration: 500,
        });
        return;
      }
      val.isDefault = val.isDefault ? 1 : 0;
      delete val.country;
      // console.log( val.isDefault);
      let data = {
        appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
        tokenString: this.$cookies.get("tokenString"),
        ...val,
      };

      this.$axios({
        method: "post",
        url: "editAddress",
        data,
      }).then((res) => {
        // console.log(res);
        this.$toast({
          message: "更改成功",
          forbidClick: true,
          duration: 500,
        });
      });
      // this.$router.push({ name: "Payment" });
      this.$router.go(-1);
    },

    onClickLeft() {
      //跳转页面
      // this.$router.push({ name: "Payment" });
        this.$router.go(-1);
    },
    onSave(val) {
      delete val.country;
      delete val.postalCode;
      // console.log(val);
      // console.log("保存");
      //新增地址
      if (!this.area.id) {
        // console.log('新增地址');
        this.add(val);
      }
      //编辑地址
      else {
        val.isDefault = Boolean(val.isDefault); 
        console.log("对比组",val.isDefault);
        console.log("对比对象",this.contrastObj);
        // console.log('编辑地址');
        for(let item in val) {
          // console.log(val.isDefault);
          if(val[item] != this.contrastObj[item]) {
            // val.isDefault = !!val.isDefault;
            // console.log(val.isDefault);
            // console.log("提交个edit的数据",val);
            this.edit(val)
            break;
          }
        }
      }
    },
    onDelete() {
      console.log("我点删除了");
      let aid = this.$route.query.aid;
      console.log(aid);
      this.$axios({
        method: "post",
        url: "deleteAddress",
        data: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: this.$cookies.get("tokenString"),
          aid: aid,
        },
      }).then((res) => {
        console.log(res);
        if (res.data.code == 10000) {
          this.$router.push({ name: "Payment" });
        }

        this.$toast({
          message: res.data.msg,
          forbidClick: true,
          duration: 200,
        });
      });
    },
    onChangeDetail(val) {
      if (val.length > 40) {
        this.$toast({
          message: "文本信息过长 长度应在40位之间",
          forbidClick: true,
          duration: 500,
        });
        return;
      }
      //   console.log("我点编辑了");
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$nextTick(() => {
        // console.log(1111);
        vm.area = {};

        if (Object.keys(vm.$route.query).length == 0) {
          // console.log("sb");

          return;
        }

        // ===================================
        else {
          let item = vm.$route.query;
          // console.log(item);
          let provincelist = item.address.split("/");
          // console.log(provincelist);
          vm.editaddress = {
            id: item.id,
            name: item.name,
            tel: item.tel,
            province: provincelist[0],
            city: provincelist[1],
            county: provincelist[2],
            addressDetail: provincelist[3],
            isDefault: item.isDefault,
            areaCode: item.areaCode,
            aid: item.aid
          };
          
          // console.log('vm.editaddress.isDefault', vm.editaddress.isDefault); 
          vm.area = vm.editaddress;
          
            // console.log("路由守卫", vm.area);
          vm.contrastObj = {...vm.area}
        }
        // console.log("vm.area ==>", vm.area);
      });
    });
  },
};
</script>
