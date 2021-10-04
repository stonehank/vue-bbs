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
    let ownerCodeKey='serverless_bbs_ownerCode'
    let oldRandOwnerCode=getFromCache(ownerCodeKey)
    let newRandOwnerCode=oldRandOwnerCode || randUniqueString()
    let defaultUser={
        id:null,
        attributes:{
            objectId: null,
            sessionToken: null,
            username: null
        }
    }
    export default {
        name: "APILayer",
        data(){
            return {
                commentsPage:1,
                countMap:this.$serverLessBBS.countMap,
                pageviewMap:this.$serverLessBBS.pageviewMap,
                errorCodeMsg: {
                    "100": "Initialization failed, Please check your appId and appKey.",
                    "401": "Unauthorized operation, Please check your appId and appKey.",
                    "403": "Access denied by api domain white list, Please check your security domain.",
                },
            }
        },

        methods: {
            /**
             * Required
             * Promise<>
             */
            serverInit(){
                return initAVObject(this.$serverLessBBS)
            },
            /**
             * Required
             * 创建页面浏览量
             * 并保存到pageviewMap
             * @param uniqStr
             * @param title
             * @returns {Promise}<Number>
             */
            __generatePageViews__(uniqStr,title){
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
                    return 1
                }).catch(ex => {
                    console.error(this.errorCodeMsg[ex.code],ex)
                });
            },
            /**
             * Required
             * 获取页面的浏览量
             * 并保存到pageviewMap
             * 不存在则先创建
             * @param uniqStr
             * @param title
             * @returns {Promise}<Number>
             */
            fetchPageViews_server(uniqStr,title){
                if(this.pageviewMap.has(uniqStr)){
                    return this.pageviewMap.get(uniqStr)
                }
                let {CounterClass} = this.$serverLessBBS
                let query= new AV.Query(CounterClass)
                return query.equalTo('uniqStr',uniqStr)
                .find()
                .then(items=>{
                    if(items.length===0){
                        // 不存在当前页面，创建
                        return this.__generatePageViews__(uniqStr,title)
                    }else{
                        if(items.length>1){
                            console.warn("Warning! The uniqStr is not unique! Current uniqStr is: "+uniqStr)
                        }
                        // 存在页面， 更新
                        let item=items[0]
                        let updateTime=item.get("time")+1
                        item.increment("time")
                        item.set('title',title)
                        return item.save().then(()=>{
                            this.pageviewMap.set(uniqStr,updateTime)
                            return updateTime
                        }).catch(()=>{
                            return updateTime-1
                        })
                    }
                }).catch(ex=>{
                    if(ex.code===101){
                        // 不存在表格 创建
                        return this.__generatePageViews__(uniqStr,title)
                    }else{
                        console.error(this.errorCodeMsg[ex.code],ex)
                    }
                })
            },

            /**
             * Required
             * 获取评论数量
             * @param uniqStr
             * @param includeReply
             * @returns {Promise}<Number>
             */
            fetchCounts_server(uniqStr, includeReply=false){
                let {CommentClass} = this.$serverLessBBS
                let query= new AV.Query(CommentClass)
                let searchPromise
                if(includeReply){
                    searchPromise=query.equalTo('uniqStr',uniqStr).count()
                }else{
                    searchPromise=query.equalTo('uniqStr',uniqStr).equalTo('replyId','').count()
                }
                return searchPromise.then((counts)=>{
                    this.countMap.set(uniqStr,counts)
                    return counts
                })
                .catch(ex=>{
                    if(ex.code===101){
                        this.countMap.set(uniqStr,0)
                        return 0
                    }else{
                        console.error('Error happen in fetch count',ex)
                        this.countMap.set(uniqStr,0)
                        return 0
                    }
                })

                // return new Promise(resolve=>{
                //     if(this.countMap.has(uniqStr)){
                //         return resolve(this.countMap.get(uniqStr))
                //     }
                //     let query= new AV.Query(CommentClass)
                //     return query.equalTo('uniqStr',uniqStr)
                //     .equalTo('replyId','')
                //     .count()
                //     .then((counts)=>{
                //         this.countMap.set(uniqStr,counts)
                //         return resolve(counts)
                //     })
                //     .catch(ex=>{
                //         if(ex.code===101){
                //             this.countMap.set(uniqStr,0)
                //             return resolve(0)
                //         }else{
                //             console.error('Error happen in fetch count',ex)
                //             this.countMap.set(uniqStr,0)
                //             return resolve(0)
                //         }
                //     })
                // })
            },
            /**
             *
             * Required
             * {
             *      id:"6155bb945e0db15b17f31d78"
             *      attributes:{
             *          createdAt: "2021-09-30T13:28:52.022Z"
                        emailVerified: false
                        mobilePhoneVerified: false
                        objectId: "6155bb945e0db15b17f31d78"
                        sessionToken: "t8hllhe8e33yrae0jwlqcu8wa"
                        updatedAt: "2021-09-30T13:28:52.022Z"
                        username: "KsswXQGgsaGBEigmrgyrdhU5F8AAlRzv"
             *      }
             * }
             * @returns {Promise}<UserObject>
             */
            signIn_server(){
                if(this.$serverLessBBS.loggedUser)return Promise.resolve(this.$serverLessBBS.loggedUser)
                const {editMode}=this.$serverLessBBS
                if(!editMode)return Promise.resolve(defaultUser)
                return new Promise((res)=>{
                    if(oldRandOwnerCode){
                        return AV.User.logIn(oldRandOwnerCode,oldRandOwnerCode)
                        .then((user)=>{
                            console.log('Can login',user)
                            return res(user)
                        })
                        .catch((err)=>{
                            console.log(err)
                            return this.signUp_server().then((user)=>res(user))
                        })
                    }else{
                        return this.signUp_server().then((user)=>res(user))
                    }
                })
            },

            /**
             *
             * Required
             */
            signUp_server(){
                const {editMode,UserClass}=this.$serverLessBBS
                if(!editMode)return Promise.resolve(defaultUser)
                newRandOwnerCode=randUniqueString()
                let user= new AV.User(UserClass)
                user.setUsername(newRandOwnerCode)
                user.setPassword(newRandOwnerCode)
                let acl = new AV.ACL();
                acl.setPublicReadAccess(true);
                acl.setPublicWriteAccess(false);
                user.setACL(acl);
                console.log('Can not get, try create new user')
                return user.save().then((user)=>{
                    console.log('Create success')
                    setCache(ownerCodeKey,newRandOwnerCode)
                    oldRandOwnerCode=newRandOwnerCode
                    return user
                })
                .catch((err)=>{
                    console.error(err)
                    return defaultUser
                })
            },


            /**
             * Required
             * 更新编辑
             * @param objectId
             * @param message
             * @returns {Promise}<CommentObject>
             */
            updateComment_server(objectId,message){
                const {editMode,CommentClass}=this.$serverLessBBS
                if(!editMode)return Promise.reject(null)
                let Ct = AV.Object.extend(CommentClass);
                let comment = new Ct({objectId,message},'PUT');
                comment.set('message',message)
                return comment.save()
                .then(data=>data.attributes)
                .catch(err=>{
                    console.error('update error!',err)
                })
            },


            /**
             * Required
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
            uploadComment_server(uploadField){
                const {CommentClass}=this.$serverLessBBS
                let Ct = AV.Object.extend(CommentClass);
                let comment = new Ct();
                for (let k in uploadField) {
                    if(!uploadField.hasOwnProperty(k))continue
                    comment.set(k,uploadField[k]);
                }
                comment.set('url',location.href)
                let acl = new AV.ACL();
                acl.setPublicReadAccess(true);
                acl.setPublicWriteAccess(false);
                return this.signIn_server()
                .then((user)=>{
                    // Set user_id
                    comment.set('user_id',user.id)
                    if(user.id)acl.setWriteAccess(user.id,true);
                    comment.setACL(acl);
                    return comment.save()
                })
                .then((response)=>{
                    console.log('upload,success',response)
                    let data=response.attributes
                    if(data.error){
                        console.error(data.error)
                        return null
                    }
                    if(!data.replyId){
                        let count=this.countMap.get(data.uniqStr)
                        this.countMap.set(data.uniqStr,count+1)
                    }
                    return data
                })
                .catch((ex)=>{
                    console.log('upload,error',ex,ex.code)
                    console.error(ex.msg)
                    return null
                })
            },

            /**
             * Required
             * @param uniqStr
             * @returns {Promise}<Array>[]
             */
            fetchComments_server(uniqStr){
                const {CommentClass}=this.$serverLessBBS
                let pageSize=1000
                return new AV.Query(CommentClass)
                .equalTo("uniqStr",uniqStr)
                .select(['nickname','rootId', 'message', 'link', 'pid', 'avatar','replyId','at','user_id'])
                .addDescending('createdAt')
                .skip((this.commentsPage-1) * pageSize)
                .limit(pageSize)
                .find()
                .then(items=>{
                    this.commentsPage++
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

        }

    }
</script>

