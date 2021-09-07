import App from "./App"
import Vue from 'vue'
import './assets/css/common.scss'
import 'create-validate-form/dist/css/CreateValidateForm.css'
window.$=require('jquery')


let vm= new Vue({
  el: '#app',
  render: h => h(App)
})
window.vm=vm

export default vm
