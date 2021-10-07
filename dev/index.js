import App from "./App"
import Vue from 'vue'




let vm= new Vue({
    el: '#app',
    render: h => h(App)
})
window.vm=vm

export default vm
