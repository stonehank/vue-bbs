<template>
    <div class="bbs-msg-wrapper"
         :class="{'msg-small':small}"
    >
        <div class="bbs-msg-body"
             :class="{'msg-small':small}"
        >
            <MessageRender :details="details" />
        </div>
        <div class="bbs-msg-action"
             :class="{'msg-small':small}"
        >
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
                            :startReply="startReply"
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
    import {replaceAtToTag, xssMarkdown} from "../../../utils/String";
    import cloneDeep from "clone-deep";
    import Loading from "../../commons/Loading";
    import {highLightEle, scrollToEle} from "../../../utils/DOM";
    import MessageRender from "./MessageRender";
    export default {
        name: "MessageBody",
        components: {
            MessageRender,
            Loading,
            MoreButton,
            ListRender:()=>import("../ListRender"),
            Button,
            SlideYUpTransition
        },
        props:{
            small:Boolean,
            needUpdateData:Object,
            details:Object,
            startReply:Function,
            loadList:Function,
            curNest:Number,
            maxNest:Number,
        },
        computed:{
            canRenderReplyBtn(){
                return this.curNest<this.maxNest
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
                // 下一层是最大嵌套数
                if(this.maxNest===this.curNest + 1){
                    this.updateDataAfterReply()
                }else if(replyId===this.details.objectId){
                    // 不是最大嵌套层，查看replyId和objectId相等时更新
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
                    console.log(data)
                    if(data.length===0){
                        this.nodata=true
                    }else{
                        this.replyList=cloneDeep(data)
                    }
                })
            },
            fetchMore(){
                this.replyPage+=1
                return this.loadData()

            },
            updateDataAfterReply(){
                console.log('update',this.showReply)
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
                    console.log(this.replyList)
                    let ele=document.getElementById(replyId).getElementsByClassName('bbs-msg-body')[0]
                    if(!ele)return
                    highLightEle(ele)
                })
            }
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
    .at{
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
