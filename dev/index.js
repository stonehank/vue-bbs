import App from "./App"
import Vue from 'vue'

import ConvertLayer from "../src/layer/firebase/ConvertLayer";
import {setLayer} from '../src/layerConfig'
setLayer(ConvertLayer)


import bbs from '../src'
// Vue.use(bbs,{
//     appId:"s8REl9WtWtOw7omr7frVIpMP-MdYXbMMI",
//     appKey:"amadgvU7WzMYQ9eqMatTHLWM",
//     editMode:true,
//     // 传入后可减少第一次请求地址
//     serverURLs:"s8rel9wt.api.lncldglobal.com",
//     CommentClass:"Comment_demo_live_vue",
//     CounterClass:"Counter_demo_live_vue",
//     server:'leancloud'
// })
Vue.use(bbs,{
    editMode:true,
    // 传入后可减少第一次请求地址
    CommentClass:"Comments",
    CounterClass:"Counter",
})

//
// import register from '../dist/register'
// register(Vue,{
//     appId:"s8REl9WtWtOw7omr7frVIpMP-MdYXbMMI",
//     appKey:"amadgvU7WzMYQ9eqMatTHLWM",
//     editMode:false,
//     // 传入后可减少第一次请求地址
//     serverURLs:"s8rel9wt.api.lncldglobal.com",
//     CommentClass:"Comment_demo_vue",
//     CounterClass:"Counter_demo_vue",
// })


let vm= new Vue({
    el: '#app',
    render: h => h(App)
})
window.vm=vm

export default vm
