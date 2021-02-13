const childroute = [
  {
    path: "/home",
    name: "Home",
    alias: "/",
    meta: {isshow: true},
    component: () => import('../views/Home.vue')
  },
  {
    path: "/menu",
    name: "Menu",
    meta: {isshow: true},
    component: () => import("../views/Menu.vue")
  },
  {
    path: "/bill",
    name: "Bill",
    meta: {isshow: false},
    component: () => import("../views/Bill.vue")
  },
  {
    path: "/my",
    name: "My",
    meta: {isshow: false},
    component: () => import("../views/My.vue")
  },
  
]


export const routes = [
  {
    path: '/',
    name: 'Main',
    component: () => import('../views/Main.vue'),
    children: childroute
  },

  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
   {
    path: '/repassword',
    name: 'Repassword',
    component: () => import('../views/RetrievePassword.vue')
   },
  {
    path: '/detail/:id',
    name: 'Detail',
    component: () => import('../views/Detail.vue')
  },
  {
    path: '/address',
    name: 'Address',
    component: () => import('../views/Address.vue')
  },
  {
    path: '/payment',
    name: 'Payment',
    component: () => import('../views/Payment.vue')
  },



  {
    path: "/userdata",
    name: "UserData",
    meta: {isshow: false},
    component: () => import("../views/UserData.vue")
  },
  {
    path: "/safe",
    name: "Safe",
    meta: {isshow: false},
    component: () => import("../views/Safe.vue")
  },
  {
    path: "/manage",
    name: "Manage",
    meta: {isshow: false},
    component: () => import("../views/Manage.vue")
  },
  {
    path: "/searchpage",
    name: "Searchpage",
    meta: {isshow: false},
    component: () => import("../views/Searchpage.vue")
  },
  {
    path: "/changepwd",
    name: "ChangePwd",
    meta: {isshow: false},
    component: () => import("../views/ChangePassword.vue")
  },
]