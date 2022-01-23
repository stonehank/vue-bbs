import App from "./App"
import Vue from 'vue'

// import register from "../src/register";
// register(Vue,{
//     editMode:true,
//     CommentClass:"Comments_demo",
//     CounterClass:"Counters_demo",
//     apiKey: 'AIzaSyAQTct1trRnIB7QLE9RZ6qZgHGahVNrvco',
//     projectId: 'servelessbbs',
//     // server:FirebaseServer
// })


let vm= new Vue({
    el: '#app',
    render: h => h(App)
})
window.vm=vm

export default vm
