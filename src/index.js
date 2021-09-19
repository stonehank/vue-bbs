import App from "./App"
import Vue from 'vue'
import './assets/css/github-markdown.scss';
import './assets/css/highlight.scss';
import './assets/css/common.scss'
import 'create-validate-form/dist/css/CreateValidateForm.css'

window.$=require('jquery')



Vue.prototype.$serverLessBBS={
  appId:"s8REl9WtWtOw7omr7frVIpMP-MdYXbMMI",
  appKey:"amadgvU7WzMYQ9eqMatTHLWM",
  editMode:false,
  // 传入后可减少第一次请求地址
  serverURLs:"s8rel9wt.api.lncldglobal.com",
  CommentClass:"Comment_demo_vue",
  CounterClass:"Counter_demo_vue",
  UserClass:"_User",
  initialLoading:true,
  countMap:new Map(),
  pageviewMap:new Map()
}


let vm= new Vue({
  el: '#app',
  render: h => h(App)
})
window.vm=vm

export default vm
