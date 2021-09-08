<template>
    <section>
        <div class="bbs-input-box">
            <div class="bbs-name-avatar bbs-input">
                <Avatar :email="email" :name="nickname" v-model="avatar" />
                <NickName ref="nickname" style="flex:1;" v-model="nickname" />
            </div>
            <Email ref="email" class="bbs-input" v-model="email" />
            <Link ref="link" class="bbs-input" v-model="link" />
        </div>
        <MessageInput ref="message" v-model="message"/>
        <ActionsController :message="message" :insertEmoji="insertEmoji"/>
        <div class="text-right mt-2">
            <Button color="success" @click="submit">提交</Button>
        </div>
<!--        <CommentList />-->
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
    import {calcValueAndPos} from "../utils/DOM";
    import Button from "./commons/UI/Button";
    export default {
        name: "ServerlessBBsPanel",
        components: {Button, Link, Email, NickName, TextFieldInput, Avatar, ActionsController, MessageInput},
        props:{
            uuid:{
                type:String,
                default:window.location.pathname + window.location.hash
            }
        },
        data(){
            return {
                submitLoading:false,
                avatar:'',
                nickname:'',
                email:'',
                link:'',
                message:'',
                rootId:null,
                parentId:null,
                replyId:null,
            }
        },
        methods:{
            validate(){
                console.log(this.$refs)
                let {nickname, email, link, message}= this.$refs
                return nickname.validate()
                    && email.validate()
                    && link.validate()
                    && message.validate()
            },
            submit(){
                console.log(this.validate())
                this.submitLoading=true
                let params={
                    avatar:this.avatar,
                    nickname:this.nickname,
                    email:this.email,
                    link:this.link,
                    message:this.message,
                    rootId:this.rootId,
                    parentId:this.parentId,
                    replyId:this.replyId,
                    uuid:this.uuid
                }
            },
            insertEmoji(emoji){
                let ele=this.$refs.messageRef.$refs['message-field'].$el
                let [newV,scrollTop,startPos]=calcValueAndPos(ele,emoji)
                this.message=newV
                this.$nextTick(function(){
                    ele.selectionStart = startPos + emoji.length;
                    ele.selectionEnd = startPos + emoji.length;
                    ele.scrollTop = scrollTop;
                    ele.focus();
                })
            }
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
