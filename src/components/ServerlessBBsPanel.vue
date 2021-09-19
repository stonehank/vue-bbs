<template>
    <div class="text-center" v-if="initialLoading">
        <Loading :size="64" />
    </div>
    <section v-else>
        <div class="bbs-input-box" ref="bbs-input-box">
            <div class="bbs-name-avatar bbs-input">
                <Avatar :email="email" :name="nickname" v-model="avatar" />
                <NickName ref="nickname" style="flex:1;" v-model="nickname" />
            </div>
            <Email ref="email" class="bbs-input" v-model="email" />
            <Link ref="link" class="bbs-input" v-model="link" />
        </div>
        <MessageInput ref="message" v-model="message"/>
        <ActionsController :message="message"
                           :insertEmoji="insertEmoji"
                           :replyId="replyId"
                           :at="at"
        />
        <div class="text-right mt-2">
            <Button color="success" @click="submit">提交</Button>
        </div>
        <CommentList
                ref="bbs-comment-list"
                :fetchResolveComments="fetchResolveComments"
                :startReply="startReply"
                :uniqStr="uniqStr"
                :maxNest="nest"
                :pageSize="pageSize"
                :needUpdateReplyId="needUpdateReplyId"
        />
    </section>
</template>

<script>
    import MessageInput from "./MessageInput/index";
    import ActionsController from "./ActionsController/index";
    import Avatar from "./InfoInput/Avatar";
    import TextFieldInput from "./commons/UI/TextFieldInput";
    import NickName from "./InfoInput/NickName";
    import Email from "./InfoInput/Email";
    import Link from "./InfoInput/Link";
    import {calcValueAndPos, scrollToEle} from "../utils/DOM";
    import Button from "./commons/UI/Button";
    import CommentList from "./CommentList/index";
    import {getFromCache, setCache} from "../utils";
    import CommentsResolve from "./DataFetchAndResolve/CommentsResolve";
    import Loading from "./commons/Loading";
    import cloneDeep from "clone-deep";
    export default {
        name: "ServerlessBBsPanel",
        extends:CommentsResolve,
        components: {
            Loading,
            CommentList, Button, Link, Email, NickName, TextFieldInput, Avatar, ActionsController, MessageInput},
        props:{
            uniqStr:{
                type:String,
                default:window.location.pathname + window.location.hash
            },
            pageSize:{
                type:Number,
                default:5
            },
            editable:Boolean,
            nest:{
                default:1
            },
        },
        data(){
            return {
                needUpdateReplyId:null,
                submitLoading:false,
                avatar:'',
                nickname:'',
                email:'',
                link:'',
                message:'',
                at:'',
                rootId:'',
                replyId:'',
                cacheKey:'serverless-bbs-vue-info',
            }
        },
        watch:{
            // 储存cookie
            ...['avatar','nickname','email','link'].reduce((obj,prop2)=>{
                if(typeof obj==='string'){
                    let str=obj
                    obj={
                        [str]:function(newV){
                            this.setCacheData(str,newV)
                        }
                    }
                }
                obj[prop2]=function(newV){
                    this.setCacheData(prop2,newV)
                }
                return obj
            }),
            // 检查是否reply
            message:function(newV){
                if(this.at && this.replyId){
                    if(!newV.startsWith(`@${this.at} `)){
                        this.cancelReply()
                    }
                }
            },
        },
        created(){
            let cacheData=this.getCacheData()
            this.nickname=cacheData.nickname
            this.email=cacheData.email
            this.link=cacheData.link
            this.avatar=cacheData.avatar
        },
        methods:{
            reset(){
                this.message=''
                this.cancelReply()
                setTimeout(()=>{
                    let {message}= this.$refs
                    message.reset()
                },0)
            },
            setCacheData(prop,val){
                let cacheData=this.getCacheData()
                cacheData[prop]=val
                setCache(this.cacheKey,cacheData)
            },
            getCacheData(){
                let cacheData=getFromCache(this.cacheKey)
                if(cacheData==null){
                    cacheData={
                        nickname:'',
                        email:'',
                        link:'',
                        avatar:''
                    }
                }
                return cacheData
            },
            validate(){
                let {nickname, email, link, message}= this.$refs
                return nickname.validate()
                    && email.validate()
                    && link.validate()
                    && message.validate()
            },
            submit(){
                this.submitLoading=true
                let params={
                    avatar:this.avatar,
                    nickname:this.nickname,
                    email:this.email,
                    link:this.link,
                    message:this.message,
                    rootId:this.rootId,
                    replyId:this.replyId,
                    uniqStr:this.uniqStr,
                    at:this.at
                }
                if(!this.validate())return
                this.uploadComments(params)
                .then((data)=>{
                    this.reset()
                    if(!data.replyId){
                        /* 更新List */
                        let newList=cloneDeep(this.$refs['bbs-comment-list'].list)
                        newList.unshift(data)
                        this.$refs['bbs-comment-list'].list=newList
                        this.$refs['bbs-comment-list'].total+=1
                    }else{
                        /* 更新reply */
                        this.needUpdateReplyId=data.replyId
                        setTimeout(()=>{
                            this.needUpdateReplyId=null
                        },0)
                    }
                })
                .finally(()=>{
                    this.submitLoading=false
                })
            },

            startReply({rootId,replyId,replyName}){
                this.at=replyName
                this.replyId=replyId
                this.rootId=rootId
                this.message=`@${replyName} `+this.message
                // window.location.hash = "reply"
                scrollToEle(this.$refs['bbs-input-box'],{
                    highlight:false,
                    smooth:true
                }).then(()=>{
                    this.$refs.message.getElement().selectionStart=this.message.length
                    this.$refs.message.getElement().selectionEnd=this.message.length
                    this.$refs.message.getElement().focus()
                })
            },
            cancelReply(){
                this.message=this.message.slice(this.at.length + 1)
                this.at=''
                this.replyId=''
                this.rootId=''
            },

            insertEmoji(emoji){
                let messageRef=this.$refs.message
                let ele=messageRef.getElement()
                let [newV,scrollTop,startPos]=calcValueAndPos(ele,emoji)
                this.message=newV
                this.$nextTick(function(){
                    ele.selectionStart = startPos + emoji.length;
                    ele.selectionEnd = startPos + emoji.length;
                    ele.scrollTop = scrollTop;
                    ele.focus();
                })
            },

        }
    }
</script>

<style scoped lang="scss">
    .bbs-input-box{
        display:flex;
        align-items: flex-end;
        justify-content: flex-start;
        flex-flow:wrap;
    }
    .bbs-name-avatar{
        display:flex;
        align-items: flex-end;
        justify-content: flex-start;
        flex-flow:nowrap;
    }
    .bbs-input{
        position: relative;
        margin:0;
        width:100%;
        @media (min-width:768px){
            flex:1;
            min-width:200px;
            margin:0 24px 0 0;
            &:last-child{
                margin:0;
            }
        }
    }
</style>
