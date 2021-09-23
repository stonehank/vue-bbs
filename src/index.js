import ServerlessBBSPanel from "./components/ServerlessBBSPanel";
import ServerlessBBSCounter from "./components/ServerlessBBSCounter";
import ServerlessBBSPageView from "./components/ServerlessBBSPageView";


let install = function (Vue, options) {
  let defaultOptions={
    appId:null,
    appKey:null,
    editMode:false,
    serverURLs:null,
    CommentClass:"Comment",
    CounterClass:"Counter",
    UserClass:"_User",
    initialLoading:true,
    countMap:new Map(),
    pageviewMap:new Map(),
  }
  if(Vue.prototype.$serverLessBBS!=null){
    throw new Error('Should not register vue-bbs twice.')
  }
  Vue.prototype.$serverLessBBS=Object.assign(defaultOptions,options)
  Vue.component('vue-bbs',ServerlessBBSPanel)
  Vue.component('vue-bbs-counter',ServerlessBBSCounter)
  Vue.component('vue-bbs-pageview',ServerlessBBSPageView)
}



export default { install }
