<template>
  <div class="headerBar">

    <van-nav-bar class="head">
      
        <template #left>
        <div class="left">
          <div class="leftlogo">
            <img class="auto-img" src="../assets/images/coffeelogo.png" />
          </div>
          <div class="lefttitle">Blue Cup~</div>
        </div>
        </template>

        <template #right>
            <div class="right-title" @click="gohome">先逛一逛</div>
        </template>

    </van-nav-bar>

  </div>
</template>

<script>
import "../assets/less/headbar.less";
export default {
  methods: {
    gohome(){
      this.$store.commit("change", false);
      this.$router.push({path: '/'})
    }
  }
};
</script>
