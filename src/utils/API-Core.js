/*
* 1. 首次请求1000个数据
* 2. 如果存在1000个数据，则显示 999+， 不足则显示确切数字
* 3. 请求的数据存在客户端，通过promise模拟api获取
*
* */
const {createNormalData}= require('./MOCK')
const cloneDeep = require('clone-deep')

let createdAt = null
let checkOnNextInsert = false
let allCommentData = []
let waitNextInserted = []
let objectIdToData={}

window.allCommentData=allCommentData

function __getRealData__(params) {
    /*
      uniqStr  // 页面唯一值
   */
    checkOnNextInsert = true
    return new Promise((res) => {
        // res(allCommentData.length === 0 ? createNormalData(5,5,3) : [])
        res(createNormalData(20,20,9))
    })
}

function __deepSearchReply__(allReplyList) {
    let res = []
    for (let i = 0; i < allReplyList.length; i++) {
        res.push(allReplyList[i])
        if(allReplyList[i].replys){
            res=res.concat(__deepSearchReply__(allReplyList[i].replys))
        }
    }
    return res
}
function __deepSearchReplyCount__(allReplyList) {
    let allCounts=0
    for (let i = 0; i < allReplyList.length; i++) {
        if(allReplyList[i].replys && allReplyList[i].replys.length>0){
            allReplyList[i].replyCounts=__deepSearchReplyCount__(allReplyList[i].replys)
            allCounts+=allReplyList[i].replyCounts + 1
        }else{
            allCounts+=1
        }
    }
    return allCounts
}

function getMoreData(params){
    console.log('mock network')
    return __getRealData__(params)
    .then(generateIndexSearch)
    .then(mergeToNest)
    .then(generateReplyCounts)
}


function fetchComments(params) {
    /*
        rootId // 存在则搜索对应rootId的数据
        replyId  // 存在则搜索对应replyId的数据
        uniqStr  // 页面唯一值
        page     // 数据页码
        pageSize  // 数据每页条数
        deepReply // 存在则深度搜索每一个回复（嵌套回复）
        deepReplyCounts // 存在则深度搜索回复数量
     */
    let { replyId, deepReply, pageSize, page, uniqStr,deepReplyCounts} = params
    let data
    if(!replyId){
        data= getMoreData({uniqStr})
    }else{
        data=Promise.resolve(allCommentData)
    }
    // console.log(params)
    return data.then((nestedData) => {
        // console.log(allCommentData,nestedData,nestedData===allCommentData)
        let filterData=nestedData
        if (replyId) {
            filterData=objectIdToData[replyId].replys
            if (deepReply) {
                filterData = __deepSearchReply__(filterData)
            }
        }
        // 这里获取从0到当前page的所有评论
        let result=cloneDeep(filterData.slice(0, pageSize * page))
        // console.log(cloneDeep(result))
        if(deepReplyCounts){
            __deepSearchReplyCount__(result)
        }
        // let result=cloneDeep(filterData.slice(pageSize * (page - 1), pageSize * page))
        result=result.map(obj=>{
            obj.replys=null
            return obj
        })

        return new Promise(res=>{
            setTimeout(()=>{
                res(result)
            },500)
        })
    })


}

function fetchCounts(params) {
    /*
        rootId // 存在则搜索对应rootId的数据
        uniqStr  // 页面唯一值
        replyId 存在则搜索对应id的数据count
        aboveNest 存在则搜索字段nest >= aboveNest的数据count
    */
    return new Promise((res) => {
        setTimeout(() => {
            res(6)
        }, 500)
    })
}


function insertReplyItem(allList, item) {
    if (!allList || allList.length === 0) return {list: allList, inserted: false}
    let {replyId, rootId} = item
    for (let i = 0; i < allList.length; i++) {
        let curDetectObj = allList[i]
        let detectObjRootId=curDetectObj.rootId || curDetectObj.objectId
        if (detectObjRootId !== rootId) continue
        if (curDetectObj.objectId === replyId) {
            if (curDetectObj.replys == null) curDetectObj.replys = []
            curDetectObj.replys.push(item)
            return {list: allList, inserted: true}
        } else {
            let res = insertReplyItem(curDetectObj.replys, item)
            if (res.inserted) {
                curDetectObj.replys=res.list
                return {list: allList, inserted: true}
            }
        }
    }
    return {list: allList, inserted: false}
}

function mergeToNest(newFetchList) {
    if (checkOnNextInsert) {
        newFetchList = newFetchList.concat(waitNextInserted)
        waitNextInserted = []
        checkOnNextInsert = false
    }
    let replyCandid = []
    for (let item of newFetchList) {
        if (item.replyId) {
            replyCandid.push(item)
            continue
        }
        allCommentData.push(item)
    }
    replyCandid.sort((a, b) => a.updatedAt < b.updatedAt ? -1 : 1)
    // DFS遍历arr
    for (let replyItem of replyCandid) {
        let res = insertReplyItem(allCommentData, replyItem)
        if (res.inserted) {
            allCommentData = res.list
        } else {
            waitNextInserted.push(replyItem)
        }
    }
    return allCommentData
}

function generateReplyCounts(list){
    for (let item of list) {
        if(item.replys && item.replys.length>0){
            item.replyCounts=item.replys.length
            generateReplyCounts(item.replys)
        }else{
            item.replyCounts=0
        }
    }
    return list
}

function generateIndexSearch(list){
    for (let item of list) {
        objectIdToData[item.objectId]=item
    }
    return list
}



module.exports={
    fetchComments,
    fetchCounts,
}

//
//
// fetchComments({
//     rootId:'',
//     replyId:'',
//     deepReply:false,
//     pageSize:3,
//     page:1,
//     uniqStr:'/'
// })
// .then((list)=>{
//     console.log(list)
// })
//
//
