import App from "./App"
import Vue from 'vue'
import './variable-dark.scss'


let vm= new Vue({
    el: '#app',
    render: h => h(App)
})
window.vm=vm

export default vm
