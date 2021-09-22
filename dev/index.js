import App from "./App"
import Vue from 'vue'


// import bbs from '../dist'
//
// Vue.use(bbs,{
//     appId:"s8REl9WtWtOw7omr7frVIpMP-MdYXbMMI",
//     appKey:"amadgvU7WzMYQ9eqMatTHLWM",
//     editMode:false,
//     // 传入后可减少第一次请求地址
//     serverURLs:"s8rel9wt.api.lncldglobal.com",
//     CommentClass:"Comment_demo_vue",
//     CounterClass:"Counter_demo_vue",
// })

import register from '../dist/register'
register(Vue,{
    appId:"s8REl9WtWtOw7omr7frVIpMP-MdYXbMMI",
    appKey:"amadgvU7WzMYQ9eqMatTHLWM",
    editMode:false,
    // 传入后可减少第一次请求地址
    serverURLs:"s8rel9wt.api.lncldglobal.com",
    CommentClass:"Comment_demo_vue",
    CounterClass:"Counter_demo_vue",
})


let vm= new Vue({
    el: '#app',
    render: h => h(App)
})
window.vm=vm

export default vm
