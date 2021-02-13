import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'

import VueCookies from 'vue-cookies'


//px转rem文件
import 'lib-flexible/flexible'




// =========vant组件
import {
  NavBar,
  Field,
  Button,
  Popup,
  Swipe,
  SwipeItem,
  Lazyload,
  Toast,
  Tabbar,
  TabbarItem,
  Tab,
  Tabs,
  Badge,
  SwipeCell,
  Card,
  Stepper,
  Checkbox,
  List,
  AddressEdit,
  AddressList,
  Empty,
  Icon,
  Uploader,
  Search,
  RadioGroup, 
  Radio,
  Dialog 
} from 'vant';
//========vant组件end


Vue
  .use(NavBar)
  .use(Field)
  .use(Button)
  .use(Popup)
  .use(Swipe)
  .use(SwipeItem)
  .use(Lazyload)
  .use(Toast)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Tab)
  .use(Tabs)
  .use(Badge)
  .use(SwipeCell)
  .use(Card)
  .use(Stepper)
  .use(Checkbox)
  .use(List)
  .use(AddressEdit)
  .use(AddressList)
  .use(Empty)
  .use(Icon)
  .use(Uploader)
  .use(Search)
  .use(RadioGroup)
  .use(Radio)
  .use(Dialog)





Vue.use(VueCookies)
Vue.config.productionTip = false





//定义全局过滤器
Vue.filter('formatDate', (data, format) => {
  //data: 需要进行格式化的数据
  //format: 格式
  // console.log('data ==> ', data);
  // console.log('format ==> ', format);

  let date = new Date(data);
  // console.log('date ==> ', date);

  //获取年份
  let year = date.getFullYear().toString();
  // console.log('year ==> ', year);

  if (/(y+)/.test(format)) {
    // console.log('有年份');
    //获取匹配组的内容
    let yearContent = RegExp.$1;
    // console.log('yearContent ==> ', yearContent);

    format = format.replace(yearContent, year.slice(year.length - yearContent.length));
  }

  //替换月日时分秒
  let dateObject = {
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  };

  for (let key in dateObject) {
    //生成动态正则表达式
    let reg = new RegExp(`(${key}+)`);
    // console.log('reg ==> ', reg);
    if (reg.test(format)) {
      //获取匹配组的内容
      let content = RegExp.$1;
      // console.log('content ==> ', content);

      format = format.replace(content, dateObject[key] >= 10 ? dateObject[key] : content.length === 2 ? '0' + dateObject[key] : dateObject[key]);
    }
  }

  return format;
})







new Vue({
  
  router,
  store,
  render: h => h(App)
}).$mount('#app')
