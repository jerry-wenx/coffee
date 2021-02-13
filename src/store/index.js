import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isShowPop: false, //控制商品详细列表弹出
    isShowCar: false, //控制购物车的列表弹出
    goodsList: [],  //购物车的商品列表
    newList: [],    //购物车的商品列表 这个是来装goodsList条数 实现懒加载功能
    numbers: 1,    //加载的次数

    Money: 0, // 计算价钱


    isEdit: false,  // 编辑按钮的状态
    goodsCount: 0,   //购物车商品的数量
    sids: [],         //sids购物车唯一标识集合字符串


    //下单页面的prolist
    prolist: []
  },
  mutations: {
  chprolist(state, arr) {
    for(let item of arr) {
      state.prolist.push(item);
    }
  },



    money(state, allprice) {
      console.log("money-->",allprice);
      state.Money = allprice;
    },


    //改变编辑的状态
    changeEdit(state, status) {
      state.isEdit = status;
    },

    change(state, res) {   // 改变详情页面是否弹出
      state.isShowPop = res;
    },
    changeisShowCar(state, res) {  //改变购物车那栏是否显示
      state.isShowCar = res;
    },
    changeGoodsCount(state, res) { //改变商品数量
      state.goodsCount = res;
    },
    delGoodsCount(state, res) {
      
      state.goodsCount -= res;
    },

    //增加或减少    res 如果是0就减一个  是1就加一个
    plusreduceCount(state, res) {
      if (res == 0) {
        state.goodsCount -= 1;
      }
      else if (res == 1) {
        state.goodsCount += 1;
      }
      // console.log(res);
    },
    addsids(state, res) { // 添加sid
      state.sids.push(res);
    },
    delsids(state, res) {
      console.log(res);
      for (let i = 0; i < state.sids.length; i++) {
      }
    },
    addgoodsList(state, res) {
      // console.log(res);
      state.goodsList = res;
    },
    delgoodsList(state, index) {
      console.log("删除的项",index);
      if (index instanceof Array) {
        for (let i in index) {
          console.log(i);
          console.log(index);
          // state.goodsList.splice(i, 1)
          state.goodsList.splice(index[i]-(i++), 1)
        }
        
      }
      else {
        state.goodsList.splice(index, 1)
        
      }

    },

    //增加某件商品的数量  res为 下标
    plusCount(state, res) {
      console.log(state.goodsList[res].count);
      state.goodsList[res].count++;

    },


    //添加懒加载数据
    addNewList(state, res) {
      // console.log('res',res);
      if (!res) {
        state.newList = [];
      }
      else {
        for (let i = 0; i < res.length; i++) {
          state.newList.push(res[i]);
        }
      }
    },
    delOneNewList(state, delData) {
    
      if (delData instanceof Array) {
        // console.log("是一个数组",delData);
        let index = 0;
        for (let i of delData) {
          // console.log(i);
          
          state.newList.splice(i-(index++), 1)
        }
        // console.log(state.newList);
      }
      else {
        state.newList.splice(delData, 1)
      }
      // state.newList.splice(delData, 1)
      console.log("newList---->",state.newList);
    },

    //当删除所有的时候清空newList
    delAllNewList(state) {

      state.newList = "";
    },



    //加numbers
    plusnum(state, res) {

      state.numbers += res;
    }

  },
  actions: {
  },
  modules: {
  }
})
