export default function (Vue, options) {
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
}