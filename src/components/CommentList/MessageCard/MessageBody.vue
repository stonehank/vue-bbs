<template>
    <div class="bbs-msg-wrapper"
         :class="{'msg-small':small}"
    >
        <div class="bbs-msg-body"
             :class="{'msg-small':small}"
        >
            <MessageRender v-if="!edit" :details="details" />
            <div v-else>
                <MessageInput ref="edit_message" v-model="editMessage" label="编辑内容" :rows="3"/>
                <ActionsController :message="editMessage"
                                   :insertEmoji="insertEmoji"
                                   :replyId="details.replyId"
                                   :at="details.at"
                />
            </div>
        </div>
        <div class="bbs-msg-action"
             :class="{'msg-small':small}"
        >
            <div v-if="edit && isOwnerComment" class="bbs-msg-action-edit">
                <Button dense
                        text
                        class="mr-4"
                        @click="closeEdit"
                >
                    取消
                </Button>
                <Button dense
                        text
                        color="success"
                        class="mr-4"
                        @click="saveEdit"
                >
                    保存
                </Button>
            </div>
            <div v-else class="bbs-msg-action-no-edit">
                <Button dense
                        v-if="isOwnerComment"
                        text
                        class="mr-4"
                        @click="showEdit"
                >
                    编辑
                </Button>
                <Button dense
                        text
                        class="mr-4"
                        color="info"
                        @click="()=>startReply({
                        rootId:details.rootId || details.objectId,
                        replyId:details.objectId,
                        replyName:details.nickname,
                    })"
                >
                    回复
                </Button>
            </div>
            <span v-if="canRenderReplyBtn" class="bbs-reply-btn">
                <Button dense v-if="replyCounts>0" @click="toggleReplyList" text>
                    <span v-if="showReply">收起评论</span>
                    <span v-else>{{replyCounts}}条评论</span>
                </Button>
            </span>
        </div>
        <div v-if="showReply && canRenderReplyBtn">
            <Loading v-if="replyLoading" :size="32" />
            <SlideYUpTransition :duration="500"  >
                <ListRender v-show="!replyLoading"
                            class="mt-2 bbs-reply-wrapper pl-1"
                            :cur-nest="curNest+1"
                            :maxNest="maxNest"
                            :list="replyList"
                            :updateCommentAsync="updateCommentInReplyAsync"
                            :needUpdateData="needUpdateData"
                            :loadList="loadList"
                />
            </SlideYUpTransition>
            <MoreButton
                    v-if="!replyLoading && replyCounts > replyList.length"
                    align="left"
                    :simple="true"
                    :nodata="nodata"
                    :loadMore="fetchMore"
            />
        </div>
    </div>
</template>

<script>
    import {SlideYUpTransition} from "vue2-transitions";
    import Button from "../../commons/UI/Button";
    import MoreButton from "../MoreButton";
    import cloneDeep from "clone-deep";
    import Loading from "../../commons/Loading";
    import {calcValueAndPos, highLightEle, scrollToEle} from "../../../utils/DOM";
    import MessageRender from "./MessageRender";
    import TextField from "../../commons/UI/TextField";
    import MessageInput from "../../MessageInput/index";
    import ActionsController from "../../ActionsController/index";
    export default {
        name: "MessageBody",
        components: {
            ActionsController,
            MessageInput,
            TextField,
            MessageRender,
            Loading,
            MoreButton,
            ListRender:()=>import("../ListRender"),
            Button,
            SlideYUpTransition
        },
        inject:['updateComment','startReply'],
        props:{
            small:Boolean,
            needUpdateData:Object,
            details:Object,
            loadList:Function,
            updateCommentAsync:Function,
            curNest:Number,
            maxNest:Number,
        },
        computed:{
            canRenderReplyBtn(){
                return this.curNest<this.maxNest
            },
            isOwnerComment(){
                if(!this.$serverLessBBS.loggedUser)return false
                return this.$serverLessBBS.loggedUser.id!=null && this.$serverLessBBS.loggedUser.id===this.details.user_id
            }
        },
        watch:{
            needUpdateData(newData){
                if(!newData)return
                let {replyId,rootId}=newData
                // 不同祖先，彻底没关系
                if(rootId!==(this.details.rootId || this.details.objectId))return
                // 已经过了最大嵌套层，不必更新
                if(this.maxNest===this.curNest)return
                // 查看replyId和objectId相等时更新
                if(replyId===this.details.objectId){
                    // console.log(1)
                    this.updateDataAfterReply()
                }else if(this.maxNest===this.curNest + 1  && this.replyList.find(obj=>obj.objectId===replyId)){
                    // 下一层是最大嵌套数
                    // console.log(2)
                    this.updateDataAfterReply()
                }
            },
        },
        data(){
            return {
                replyCounts:this.details.replyCounts || 0,
                replyLoading:false,
                showReply:false,
                replyList:[],
                replyPage:1,
                nodata:false,
                edit:false,
                editMessage:this.details.message,
            }
        },
        methods:{
            toggleReplyList(){
                if(this.showReply){
                    this.showReply=false
                    this.replyList=[]
                    return Promise.resolve()
                }else{
                    this.replyLoading=true
                    this.showReply=true
                    return this.loadData()
                    .finally(()=> this.replyLoading=false)
                }
            },
            loadData(){
                let params={
                    replyId:this.details.objectId,
                    page:this.replyPage,
                    deepReply:this.curNest + 1 === this.maxNest,
                    deepReplyCounts:this.curNest + 2 >= this.maxNest,
                }
                return this.loadList(params)
                .then(({data})=>{
                    if(data.length===0){
                        this.nodata=true
                    }else{
                        this.replyList=cloneDeep(data)
                    }
                })
            },
            saveEdit(){
                if(!this.validate())return
                let id=this.details.objectId
                this.updateComment(id,this.editMessage)
                .then(data=>{
                    if(!data)return
                    this.closeEdit()
                    this.updateCommentAsync(id,data)
                })
            },
            updateCommentInReplyAsync(id,data){
                let replyData=this.replyList.find(obj=>obj.objectId===id)
                if(replyData){
                    replyData.message=data.message
                    replyData.updatedAt=data.updatedAt
                }else{
                    this.updateCommentAsync(id,data)
                }
            },
            fetchMore(){
                this.replyPage+=1
                return this.loadData()

            },
            updateDataAfterReply(){
                let next
                if(!this.showReply){
                    next=this.toggleReplyList()
                }else{
                    next=this.loadData()
                }
                next.then(()=>{
                    this.replyCounts++
                    return scrollToEle(document.getElementById(this.details.objectId),{
                        highlight:false,
                        smooth:true
                    })
                })
                .then(()=>{
                    let replyId=this.replyList[0].objectId
                    let ele=document.getElementById(replyId).getElementsByClassName('bbs-msg-body')[0]
                    if(!ele)return
                    highLightEle(ele)
                })
            },
            insertEmoji(emoji) {
                let messageRef = this.$refs.edit_message
                let ele = messageRef.getElement()
                let [newV, scrollTop, startPos] = calcValueAndPos(ele, emoji)
                this.editMessage = newV
                this.$nextTick(function () {
                    ele.selectionStart = startPos + emoji.length;
                    ele.selectionEnd = startPos + emoji.length;
                    ele.scrollTop = scrollTop;
                    ele.focus();
                })
            },
            showEdit(){
                this.edit=true
                this.editMessage=this.details.message
            },
            closeEdit(){
                this.edit=false
                this.editMessage=this.details.message
            },
            validate() {
                return this.$refs.edit_message.validate()
            },
        }
    }
</script>

<style scoped lang="scss">
    .bbs-msg-wrapper{
        margin-left:36px;
        &.msg-small{
            margin-left:30px;
        }
    }
    .bbs-msg-body{
        transition:background-color 1s, color 1s;
        word-wrap: break-word;
        word-break: break-all;
        text-align: justify;
        color: var(--bbs-text-primary);
        font-size: 16px;
        line-height: 1.5;
        position: relative;
        margin-top:8px;
        &.msg-small{
            margin-top:4px;
            font-size:14px;
        }
        pre{
            white-space: pre-wrap;
        }
    }
    .bbs-msg-action{
        display: flex;
        align-items: center;
        margin-top:8px;
        &.msg-small{
            margin-top:4px;
        }
    }
    .bbs-msg-action-edit, .bbs-msg-action-no-edit{
        display: flex;
        align-items: center;
    }
    .bbs-at{
        text-decoration: none;
        color: var(--bbs-text-secondary);
        font-weight: 500;
    }
    .bbs-reply-wrapper{
        border-left: 1px dashed var(--bbs-text-muted);
    }
    .bbs-reply-btn{
        display:flex;
        align-items: center;
    }
</style>
