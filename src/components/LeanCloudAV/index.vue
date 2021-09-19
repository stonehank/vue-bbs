<template>

</template>

<script>
    /**
     * Vue -> $serverLessBBS
     * appId
     * appKey
     * serverURLs
     * CommentClass
     * CounterClass
     * UserClass
     */
    import AV from './CustomAV'
    import {getFromCache,randUniqueString,setCache} from "../../utils";
    import initAVObject from "./initAVObject";
    let ownerCodeKey='serverless-bbs-ownerCode'
    let oldRandOwnerCode=getFromCache(ownerCodeKey)
    let newRandOwnerCode=oldRandOwnerCode || randUniqueString()
    export default {
        name: "LeanCloudAV",
        data(){
            return {
                initialLoading:true,
                page:1,
                time:1,
                countMap:this.$serverLessBBS.countMap,
                pageviewMap:this.$serverLessBBS.pageviewMap,
                errorCodeMsg: {
                    "100": "Initialization failed, Please check your appId and appKey.",
                    "401": "Unauthorized operation, Please check your appId and appKey.",
                    "403": "Access denied by api domain white list, Please check your security domain.",
                },
            }
        },
        mounted(){
            initAVObject(this.$serverLessBBS)
            .then(()=>{
                this.initialLoading=false
            })
        },
        methods: {

            /**
             * 获取页面的浏览量
             * 并保存到pageviewMap
             * 不存在则先创建
             * @param uniqStr
             * @param title
             * @returns {Promise}<Number>
             */
            leancloud_getPageview(uniqStr,title){
                let {CounterClass} = this.$serverLessBBS
                return new Promise(resolve=>{
                    if(this.pageviewMap.has(uniqStr)){
                        return resolve(this.pageviewMap.get(uniqStr))
                    }else{
                        let query= new AV.Query(CounterClass)
                        return query.equalTo('uniqStr',uniqStr)
                        .find()
                        .then(items=>{
                            if(items.length===0){
                                return this.leancloud_createPageviewCounter(uniqStr,title)
                                .then(()=>{
                                    this.pageviewMap.set(uniqStr,1)
                                    return resolve(1)
                                })
                            }else{
                                if(items.length>1){
                                    console.warn("Warning! The uniqStr is not unique! Current uniqStr is: "+uniqStr)
                                }
                                let item=items[0]
                                let updateTime=item.get("time")+1
                                item.increment("time")
                                item.set('title',title)
                                return item.save().then(()=>{
                                    this.pageviewMap.set(uniqStr,updateTime)
                                    return resolve(updateTime)
                                }).catch(()=>{
                                    return resolve(updateTime-1)
                                })
                            }
                        }).catch(ex=>{
                            if(ex.code===101){
                                return this.leancloud_createPageviewCounter(uniqStr,title)
                                .then(()=>{
                                    this.pageviewMap.set(uniqStr,1)
                                    return resolve(1)
                                })
                            }else{
                                console.error(this.errorCodeMsg[ex.code],ex)
                            }
                        })
                    }
                })
            },


            /**
             *
             * @param uniqStr
             * @param title
             * @returns {Promise}<Void>
             */
            leancloud_createPageviewCounter(uniqStr,title=''){
                let {CounterClass} = this.$serverLessBBS
                let Ct = AV.Object.extend(CounterClass);
                let newCounter = new Ct();
                let acl = new AV.ACL();
                acl.setPublicReadAccess(true);
                acl.setPublicWriteAccess(true);
                newCounter.setACL(acl);
                newCounter.set('uniqStr', uniqStr)
                newCounter.set('title', title)
                newCounter.set('time', 1)
                return newCounter.save().then(() => {
                    this.pageviewMap.set(uniqStr,1)
                }).catch(ex => {
                    console.error(this.errorCodeMsg[ex.code],ex)
                });
            },

            /**
             * TODO
             * @param id
             * @returns {Promise}<Boolean>
             */
            // checkCanEdit(id){
            //     const {editMode}=this.props
            //     if(!editMode)return Promise.resolve(false)
            //     return new AV.Query(this.props.CommentClass)
            //     .equalTo('objectId',id)
            //     .equalTo('ownerCode',oldRandOwnerCode)
            //     .find()
            //     .then(ownerItems=>{
            //         return ownerItems && ownerItems.length>0
            //     })
            //     .catch(ex=>{
            //         console.error('Error happen in check can edit',ex)
            //     })
            // },

            /**
             * 获取评论数量（不包括回复数量）
             * @param uniqStr
             * @returns {Promise}<Number>
             */
            leancloud_fetchCommentCount(uniqStr){
                let {CommentClass} = this.$serverLessBBS
                return new Promise(resolve=>{
                    if(this.countMap.has(uniqStr)){
                        return resolve(this.countMap.get(uniqStr))
                    }
                    let query= new AV.Query(CommentClass)
                    return query.equalTo('uniqStr',uniqStr)
                    .equalTo('replyId','')
                    .count()
                    .then((counts)=>{
                        this.countMap.set(uniqStr,counts)
                        return resolve(counts)
                    })
                    .catch(ex=>{
                        if(ex.code===101){
                            this.countMap.set(uniqStr,0)
                            return resolve(0)
                        }else{
                            console.error('Error happen in fetch count',ex)
                        }
                    })
                })
            },

            /**
             *
             * @param uniqStr
             * @param count
             */
            leancloud_updateCommentCount(uniqStr,count){
                this.countMap.set(uniqStr,count)
            },

            /**
             *
             * todo need to define UserObject
             * @returns {Promise}<UserObject>
             */
            getUser(){
                const {editMode,UserClass}=this.$serverLessBBS
                if(!editMode)return Promise.reject('Forbid the edit!')
                let createUser=(res)=>{
                    let user= new AV.User(UserClass)
                    user.setUsername(newRandOwnerCode)
                    user.setPassword(newRandOwnerCode)
                    let acl = new AV.ACL();
                    acl.setPublicReadAccess(true);
                    acl.setPublicWriteAccess(false);
                    user.setACL(acl);
                    console.log('Can not get, try create new user')
                    return user.save().then((u)=>{
                        console.log('Create success')
                        this.time++
                        oldRandOwnerCode=newRandOwnerCode
                        res(u)
                    })
                }
                return new Promise((res)=>{
                    if(oldRandOwnerCode && AV.User.current() && AV.User.current().attributes.username===oldRandOwnerCode){
                        console.log('Has login')
                        return res(AV.User.current())
                    }
                    if(oldRandOwnerCode){
                        return AV.User.logIn(oldRandOwnerCode,oldRandOwnerCode)
                        .then((user)=>{
                            console.log('Can login')
                            res(user)
                        })
                        .catch(()=>{
                            newRandOwnerCode=randUniqueString()
                            createUser(res).then(()=>{
                                return this.getUser()
                            })

                        })
                    }else{
                        if(this.time===2) return res(null)
                        createUser(res).then(()=>{
                            return this.getUser()
                        })
                    }
                })
            },

            /**
             * TODO
             * todo defined CommentObject
             * 更新编辑
             * @param id
             * @param comment
             * @param commentRaw
             * @returns {Promise}<CommentObject>
             */
            leancloud_saveEditMessage({id,comment}){
                const {editMode,CommentClass}=this.$serverLessBBS
                if(!editMode)return Promise.reject(null)
                return this.getUser()
                .then(()=>{
                    return  new AV.Query(CommentClass).get(id)
                    .then((item)=>{
                        item.set('ownerCode',newRandOwnerCode)
                        item.set('message',message)
                        // 这里当用户被删除后，无法修改ownerCode
                        return item.save()
                    })
                    .catch((err)=>{
                        return new Error('Can not found comment, '+err)
                    })
                }).catch(err=>{
                    throw new Error('Can not modify! '+err)
                })
            },

            /**
             * uploadField
             * {
                  replyId: '',
                  email: '',
                  avatar: '',
                  link: '',
                  message: '',
                  at: '',
                  nickname: '',
                  uniqStr: this.props.uniqStr,

             * }
             * submit新的评论
             * @param uploadField
             * @returns {Promise}<CommentObject>
             */
            leanCloud_uploadComment(uploadField){
                const {CommentClass}=this.$serverLessBBS
                let Ct = AV.Object.extend(CommentClass);
                let comment = new Ct();
                for (let k in uploadField) {
                    if (Object.prototype.hasOwnProperty.call(uploadField,k)) {
                        let val = uploadField[k];
                        comment.set(k,val);
                    }
                }
                comment.set('url',location.pathname + location.hash)
                // comment.save()
                let acl = new AV.ACL();
                acl.setPublicReadAccess(true);
                acl.setPublicWriteAccess(false);
                return this.getUser()
                .then((user)=>{
                    console.log('got user,starting upload in leancloud...')
                    acl.setWriteAccess(user.id,true);
                    comment.setACL(acl);
                    comment.set(ownerCodeKey,newRandOwnerCode)
                    setCache(ownerCodeKey,newRandOwnerCode)
                    return comment.save()
                })
                .catch((err)=>{
                    console.log('no user,starting upload in leancloud...')
                    console.warn('Cant not get User '+err )
                    comment.setACL(acl);
                    return comment.save()
                })
                .then(data=>data.attributes)
                .then(data=>{
                    if(!data.replyId){
                        let count=this.countMap.get(data.uniqStr)
                        this.leancloud_updateCommentCount(data.uniqStr,  count+1)
                    }
                    return data
                })
            },

            /**
             *
             * @param uniqStr
             * @returns {Promise}<Array>[]
             */
            leancloud_fetchListFrom(uniqStr){
                const {CommentClass}=this.$serverLessBBS
                let pageSize=1000
                return new AV.Query(CommentClass)
                .equalTo("uniqStr",uniqStr)
                .select(['nickname','rootId', 'message', 'link', 'pid', 'avatar','replyId','at'])
                .addDescending('createdAt')
                .skip((this.page-1) * pageSize)
                .limit(pageSize)
                .find()
                .then(items=>{
                    this.page++
                    return items.map(obj=>obj.attributes)
                })
                .catch(ex=>{
                    if(ex.code===101){
                        return []
                    }else{
                        console.error('Error happen in fetch owner task',ex)
                    }
                })
            },

            /**
             * TODO
             * @param uniqStr
             * @returns {Promise}<Array>
             */
            fetchOwnerTask(uniqStr){
                const {editMode}=this.props
                if(!editMode)return Promise.resolve([])
                return new AV.Query(this.props.CommentClass)
                .equalTo('uniqStr',uniqStr)
                .equalTo('ownerCode',oldRandOwnerCode)
                .find()
                .then(ownerItems=>{
                    if(ownerItems.length===0){
                        return ownerItems
                    }
                    return new AV.Query(this.state.UserClass)
                    .equalTo('username',oldRandOwnerCode)
                    .find()
                    .then((validUser)=>{
                        if(validUser.length===0){
                            return []
                        }else{
                            return ownerItems
                        }
                    })
                })
                .catch(ex=>{
                    if(ex.code===101){
                        return []
                    }else{
                        console.error('Error happen in fetch owner task',ex)
                    }
                })
            },


        }

    }
</script>

<style scoped>

</style>
