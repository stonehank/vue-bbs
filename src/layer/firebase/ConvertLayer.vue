<template>

</template>

<script>
    import APILayer from "./APILayer";
    import cloneDeep from "clone-deep";

    export default {
        name: "ConvertLayer",
        extends:APILayer,
        data() {
            return {
                noMoreRemoteData:false,
                allCommentData: [],
                objectIdToData: {},
                waitNextInserted: [],
                checkOnNextInsert: false
            }
        },
        methods:{
            /**
             * Required
             */
            fetchPageViews (uniqStr){
                return this.fetchPageViews_server(uniqStr)
            },
            /**
             * Required
             */
            fetchCounts(uniqStr){
                return this.fetchCounts_server(uniqStr)
            },
            /**
             * Required
             */
            updateComment(id,message){

            },
            /**
             * Required
             */
            uploadComment(uploadField){
                return this.uploadComment_server(uploadField)
                .then(data=>{
                    if(!data)return null
                    this.__insertInToList__(this.allCommentData,data)
                    return data
                })
                .catch(_=>{
                    return null
                })
            },
            /**
             * Required
             */
            fetchCurrentUser(){
                return this.signIn_server()
                .then(user=>{
                    let simpleUser={
                        id:user.uid,
                        email:user.email,
                    }
                    this.$serverLessBBS.loggedUser=simpleUser
                    return simpleUser
                })
            },
            /**
             * Required
             * @param params
             * @returns {Promise<Object>} {data, total}
             */
            fetchComments(params) {
                /*
                     uniqStr         // 页面唯一值
                     rootId          // rootId， 用于插入数据
                     replyId         // 存在则搜索对应replyId的数据
                     page            // 数据页码
                     pageSize        // 数据每页条数
                     deepReply       // Boolean, 存在则深度搜索每一个回复（嵌套回复）
                     deepReplyCounts // 存在则深度搜索回复数量
                  */
                let {uniqStr, replyId, pageSize, page, deepReply, deepReplyCounts} = params
                let data
                this.checkOnNextInsert=true
                if (!replyId && !this.noMoreRemoteData) {
                    data = this.__getMoreData__(uniqStr)
                } else {
                    data = Promise.resolve(this.allCommentData)
                }
                return data.then((nestedData) => {
                    let filterData = nestedData
                    if (replyId) {
                        filterData = this.objectIdToData[replyId].replys
                        if (deepReply) {
                            filterData = this.__deepSearchReply__(filterData)
                        }
                    }else{
                        if (deepReply) {
                            filterData = Object.values(this.objectIdToData)
                        }
                    }
                    // 这里获取从0到当前page的所有评论
                    let result = cloneDeep(filterData.slice(0, pageSize * page))
                    if (deepReplyCounts) {
                        this.__deepSearchReplyCount__(result)
                    }
                    result = result.map(obj => {
                        obj.replys = null
                        return obj
                    }).sort((a,b)=>a.createdAt < b.createdAt ? 1 : -1)

                    return new Promise(res => {
                        setTimeout(() => {
                            res({
                                data:result,
                                total:this.allCommentData.length
                            })
                        }, 200)
                    })
                })
            },


            __updateCommentAfterEdit__(objectId,editData){
                let comment=this.objectIdToData[objectId]
                comment.message=editData.message
                comment.updatedAt=editData.updatedAt
            },
            __insertInToList__(list,data){
                // 插入到对应的嵌套层，同时也要更新replyCounts数字
                if(data.replyId){
                    let replyData=this.objectIdToData[data.replyId]
                    if(replyData.replys==null){
                        replyData.replys=[]
                        replyData.replyCounts=0
                    }
                    replyData.replys.unshift(data)
                    replyData.replyCounts++
                }else{
                    list.unshift(data)
                }
                this.objectIdToData[data.objectId]=data
            },
            __getMoreData__(uniqStr) {
                console.log('mock network')
                return this.fetchComments_server(uniqStr)
                .then(flatList=>{
                    this.noMoreRemoteData = flatList.length < 1000;
                    return flatList
                })
                .then(this.__generateIndexSearch__)
                .then(this.__mergeToNest__)
                .then(this.__generateReplyCounts__)
            },
            __deepSearchReply__(allReplyList) {
                let res = []
                for (let i = 0; i < allReplyList.length; i++) {
                    res.push(allReplyList[i])
                    if (allReplyList[i].replys) {
                        res = res.concat(this.__deepSearchReply__(allReplyList[i].replys))
                    }
                }
                return res
            },
            __deepSearchReplyCount__(allReplyList) {
                let allCounts = 0
                for (let i = 0; i < allReplyList.length; i++) {
                    if (allReplyList[i].replys && allReplyList[i].replys.length > 0) {
                        allReplyList[i].replyCounts = this.__deepSearchReplyCount__(allReplyList[i].replys)
                        allCounts += allReplyList[i].replyCounts + 1
                    } else {
                        allCounts += 1
                    }
                }
                return allCounts
            },
            __mergeToNest__(newFetchList) {
                if (this.checkOnNextInsert) {
                    newFetchList = newFetchList.concat(this.waitNextInserted)
                    this.waitNextInserted = []
                    this.checkOnNextInsert = false
                }
                let replyCandid = []
                for (let item of newFetchList) {
                    if (item.replyId) {
                        replyCandid.push(item)
                        continue
                    }
                    this.allCommentData.push(item)
                }
                replyCandid.sort((a, b) => a.createdAt < b.createdAt ? -1 : 1)
                // DFS遍历arr
                for (let replyItem of replyCandid) {
                    let res = this.__insertReplyItem__(this.allCommentData, replyItem)
                    if (res.inserted) {
                        this.allCommentData = res.list
                    } else {
                        this.waitNextInserted.push(replyItem)
                    }
                }
                return this.allCommentData
            },
            __generateReplyCounts__(list) {
                for (let item of list) {
                    if (item.replys && item.replys.length > 0) {
                        item.replyCounts = item.replys.length
                        this.__generateReplyCounts__(item.replys)
                    } else {
                        item.replyCounts = 0
                    }
                }
                return list
            },
            __generateIndexSearch__(list) {
                for (let item of list) {
                    this.objectIdToData[item.objectId] = item
                }
                return list
            },
            __insertReplyItem__(allList, item) {
                if (!allList || allList.length === 0) return {list: allList, inserted: false}
                allList.sort((a,b)=>a.createdAt < b.createdAt ? 1 : -1)
                let {replyId, rootId} = item
                for (let i = 0; i < allList.length; i++) {
                    let curDetectObj = allList[i]
                    let detectObjRootId = curDetectObj.rootId || curDetectObj.objectId
                    if (detectObjRootId !== rootId) continue
                    if (curDetectObj.objectId === replyId) {
                        if (curDetectObj.replys == null) curDetectObj.replys = []
                        curDetectObj.replys.push(item)
                        return {list: allList, inserted: true}
                    } else {
                        let res = this.__insertReplyItem__(curDetectObj.replys, item)
                        if (res.inserted) {
                            curDetectObj.replys = res.list
                            return {list: allList, inserted: true}
                        }
                    }
                }
                return {list: allList, inserted: false}
            }
        }
    }
</script>

<style scoped>

</style>
