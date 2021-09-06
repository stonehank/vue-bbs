import App from "./App"
import Vue from 'vue'
import './assets/css/common.scss'



let vm= new Vue({
  el: '#app',
  render: h => h(App)
})
window.vm=vm
window.$=require('jquery')
export default vm
