import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {//标准价格详情
      path: '/standardPriceDetail',
      name: 'standardPriceDetail',
        component: () => import('@/views/priceManagement/standardPriceDetail.vue')
    },
    {//标准价格列表
      path: '/standardPriceList',
      name: 'standardPriceList',
      component: () => import('../views/priceManagement/standardPriceList.vue')
    },
    {//区域价格列表
      path: '/regionalPriceList',
      name: 'regionalPriceList',
      component: () => import('../views/priceManagement/regionalPriceList.vue')
    },

    {//区域价格详情
      path: '/regionalPriceDetail',
      name: 'regionalPriceDetail',
      component: () => import('../views/priceManagement/regionalPriceDetail.vue')
    },
    {//人员价格折扣表
      path: '/personnelDiscountList',
      name: 'personnelDiscountList',
      component: () => import('../views/priceManagement/personnelDiscountList.vue')
    },

    {//人员价格折扣详情
      path: '/personnelDiscountDetail',
      name: 'personnelDiscountDetail',
      component: () => import('../views/priceManagement/personnelDiscountDetail.vue')
    },
  ]
})

export default router
