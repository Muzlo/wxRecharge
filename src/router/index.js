import Vue from 'vue'
import Router from 'vue-router'

import index from '@/components/index'
import home from '@/components/home'
import myPackage from '@/components/myPackage'
import packageList from '@/components/packageList'
import recommendList from '@/components/recommendList'
import recommendPackageDetails from '@/components/recommendPackageDetails'
import custnormal from '@/components/custnormal'
import custflow from '@/components/custflow'
import packageDetails from '@/components/packageDetails'
import flowState from '@/components/flowState'
import billRecord from '@/components/billRecord'
import deviceList from '@/components/deviceList'
import homeRecharge from '@/components/homeRecharge'
Vue.use(Router)

export default new Router({
  routes: [

    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/home',
      name: 'home',
      component: home
    },
    {
      path: '/myPackage',
      name: 'myPackage',
      component: myPackage
    },
    {
      path: '/flowState',
      name: 'flowState',
      component: flowState
    },
    {
      path: '/billRecord/:cardNum',
      name: 'billRecord',
      component: billRecord
    },
    {
      path: '/packageList',
      name: 'packageList',
      component: packageList
    },
    {
      path: '/wx/custnormal',
      name: 'custnormal',
      component: custnormal
    },
    {
      path: '/wx/custflow',
      name: 'custflow',
      component: custflow
    },
    {
      path: '/wx/packageDetails',
      name: 'packageDetails',
      component: packageDetails
    },

    {
      path: '/deviceList',
      name: 'deviceList',
      component: deviceList
    },
    {
      path: '/recommendList',
      name: 'recommendList',
      component: recommendList
    },
    {
      path: '/homeRecharge',
      name: 'homeRecharge',
      component: homeRecharge
    },
    {
      path: '/wx/recommendPackageDetails',
      name: 'recommendPackageDetails',
      component: recommendPackageDetails
    }
  ]
})
