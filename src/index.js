import ServerlessBBSPanel from "./components/ServerlessBBSPanel";
import ServerlessBBSCounter from "./components/ServerlessBBSCounter";
import ServerlessBBSPageView from "./components/ServerlessBBSPageView";
import register from './register'


let install = function (Vue, options) {
  register(Vue,options)
  Vue.component('vue-bbs',ServerlessBBSPanel)
  Vue.component('vue-bbs-counter',ServerlessBBSCounter)
  Vue.component('vue-bbs-pageview',ServerlessBBSPageView)
}



export default { install }
