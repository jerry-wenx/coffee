<template>
  <div id="app">
    <!-- <router-link to="/">gohome</router-link> |
    <router-link to="/login">login</router-link> |
    <router-link to="/about">about</router-link> -->

    <!-- <keep-alive> -->
      <router-view />
    <!-- </keep-alive> -->
  </div>
</template>

<script>
export default {
  created() {
    // console.log("这里是App.vue");
    let tokenString = this.$cookies.get("tokenString");
    if (!tokenString) {
      this.$router.push({ name: "Login" });
      return;
    }

    this.$axios({
      methods: "get",
      url: "findAllShopcart",
      params: {
        appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
        tokenString: tokenString,
      },
    }).then((res) => {
      if (res.data.code == 5000) {
        let count = 0;
        for (let k of res.data.result) {
          count += k.count;
           k.checked = false;
        }
        this.$store.commit("addgoodsList", res.data.result);
        this.$store.commit("changeGoodsCount", count);
      }
    });
  },
};
</script>


<style lang="less">
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-bottom: 60px;
  // padding: 15px;
}
.auto-img {
  width: 100%;
  display: block;
}
body {
  // background-color: rgb(241, 240, 240);
 background-color: #f5f5f5;
    
}
.one-text {
  width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
