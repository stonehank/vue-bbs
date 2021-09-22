<template>

</template>

<script>
    import cloneDeep from 'clone-deep'
    import DateFetch from "./DataFetch";
    export default {
        name: "CommentsResolve",
        extends:DateFetch,
        data() {
            return {
                noMoreRemoteData:false,
                allCommentData: [],
                objectIdToData: {},
                waitNextInserted: [],
                checkOnNextInsert: false
            }
        },

        mounted() {
        },
        /**
         * STEP1: 一次性获取1000个数据
         * STEP2: 转换为嵌套数据, 并且计算回复数
         * STEP3: 根据参数要求提供对应的数据展示
         * 更少的API调用，但是会获取更多的数据
         */
        methods: {
            uploadComments(uploadField){
                return this.uploadMessageToServer(uploadField)
                .then(data=>{
                    if(!data)return null
                    this.insertInToList(this.allCommentData,data)
                    return data
                })
            },
            insertInToList(list,data){
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
            fetchResolveComments(params) {
                /*
                    uniqStr         // 页面唯一值
                    rootId          // rootId， 用于插入数据
                    replyId         // 存在则搜索对应replyId的数据
                    page            // 数据页码
                    pageSize        // 数据每页条数
                    deepReply       // 存在则深度搜索每一个回复（嵌套回复）
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
                        if (deepReply!=null) {
                            filterData = this.__deepSearchReply__(filterData)
                        }
                    }else{
                        if (deepReply!=null) {
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
            __getMoreData__(uniqStr) {
                console.log('mock network')
                return this.fetchDataFromServer(uniqStr)
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
