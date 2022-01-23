import ServerlessBBSPanel from "./components/ServerlessBBSPanel";
import ServerlessBBSCounter from "./components/ServerlessBBSCounter";
import ServerlessBBSPageView from "./components/ServerlessBBSPageView";
import ConvertLayer from './layer/leancloud/ConvertLayer'
import register from './register'
import registerServer from "./registerServer";

let install = function (Vue, options) {
  register(Vue,options)
  let extendServer=options.server
  if(!extendServer || typeof extendServer!=='object'){
    extendServer=ConvertLayer
    console.warn('Parameters server is required. By default will use Leancloud as a server.')
  }
  registerServer(ServerlessBBSPanel,extendServer)
  registerServer(ServerlessBBSCounter,extendServer)
  registerServer(ServerlessBBSPageView,extendServer)
  Vue.component('vue-bbs',ServerlessBBSPanel)
  Vue.component('vue-bbs-counter',ServerlessBBSCounter)
  Vue.component('vue-bbs-pageview',ServerlessBBSPageView)
}


export default { install }
