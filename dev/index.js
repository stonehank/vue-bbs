// import App from "./App"
import AppLocal from "./AppLocal"
import Vue from 'vue'
// import '../demo-src/variable-dark.scss'



// import bbs from '../src'
import ConvertLayer from "../src/layer/firebase/ConvertLayer";
import {setLayer} from '../src/layerConfig'
setLayer(ConvertLayer)

// Vue.use(bbs,{
//     appId:"s8REl9WtWtOw7omr7frVIpMP-MdYXbMMI",
//     appKey:"amadgvU7WzMYQ9eqMatTHLWM",
//     editMode:false,
//     // 传入后可减少第一次请求地址
//     serverURLs:"s8rel9wt.api.lncldglobal.com",
//     CommentClass:"Comment_demo_live_vue",
//     CounterClass:"Counter_demo_live_vue",
//     server:'leancloud'
// })
// Vue.use(bbs,{
//     editMode:false,
//     CommentClass:"Comments",
//     CounterClass:"Counter",
//     apiKey: 'AIzaSyBtD9cKCV0pkqoIUU9OoTxP4mfOgqgGyfo',
//     authDomain: 'test-bb11c.firebaseio.com',
//     projectId: 'test-bb11c'
// })

//
import register from '../src/register'
// register(Vue,{
//     appId:"s8REl9WtWtOw7omr7frVIpMP-MdYXbMMI",
//     appKey:"amadgvU7WzMYQ9eqMatTHLWM",
//     editMode:true,
//     // 传入后可减少第一次请求地址
//     serverURLs:"s8rel9wt.api.lncldglobal.com",
//     CommentClass:"Comment_demo_live_vue",
//     CounterClass:"Counter_demo_live_vue",
// })
register(Vue,{
    editMode:false,
    CommentClass:"Comments",
    CounterClass:"Counter",
    apiKey: 'AIzaSyAQTct1trRnIB7QLE9RZ6qZgHGahVNrvco',
    authDomain: 'servelessbbs.firebaseio.com',
    projectId: 'servelessbbs'
})

let vm= new Vue({
    el: '#app',
    render: h => h(AppLocal)
})
window.vm=vm

export default vm
