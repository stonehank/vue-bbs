<template>
    <div class="bbs-msg-wrapper"
         :class="{'msg-small':small}"
    >
        <div class="bbs-msg-body"
             :class="{'msg-small':small}"
        >
            <div v-html="renderMessage"></div>
        </div>
        <div class="bbs-msg-action"
             :class="{'msg-small':small}"
        >
            <Button dense
                    text
                    class="mr-4"
                    color="info"
                    @click="()=>startReply({
                        replyId:details.objectId,
                        replyName:details.nickname,
                        rootId:details.rootId,
                        nest:curNest + 1
                    })"
            >
                回复
            </Button>
            <span v-if="canRenderReplyBtn" class="bbs-reply-btn">
<!--                <span v-if="details.replyCounts===0" class="text-secondary text-sm">-->
<!--                    无评论-->
<!--                </span>-->
                <Button dense v-if="details.replyCounts>0" @click="toggleReplyList" text>
                    <span v-if="showReply">收起评论</span>
                    <span v-else>{{details.replyCounts}}条评论</span>
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
                            :loadList="loadList"
                />
            </SlideYUpTransition>
            <MoreButton
                    v-if="!replyLoading && details.replyCounts > replyList.length"
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
    import Button from "../commons/UI/Button";
    import MoreButton from "./MoreButton";
    import {replaceAtToTag, xssMarkdown} from "../../utils/String";
    import cloneDeep from "clone-deep";
    import Loading from "../commons/Loading";
    export default {
        name: "MessageBody",
        components: {
            Loading,
            MoreButton,
            ListRender:()=>import("./ListRender"),
            Button,
            SlideYUpTransition
        },
        props:{
            small:Boolean,
            details:Object,
            startReply:Function,
            loadList:Function,
            curNest:Number,
            maxNest:Number,
        },
        computed:{
            canRenderReplyBtn(){
                return this.curNest<this.maxNest
            },
            renderMessage(){
                return xssMarkdown(replaceAtToTag(this.details.message,this.details.replyId,this.details.at))
            },
        },
        data(){
            return {
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
                }else{
                    this.replyLoading=true
                    this.showReply=true
                    this.fetchReplyList(this.replyPage)
                    .finally(()=> this.replyLoading=false)
                }
            },
            fetchReplyList(page){
                let params={
                    replyId:this.details.objectId,
                    page:page,
                    deepReply:this.curNest + 1 === this.maxNest,
                    deepReplyCounts:this.curNest + 2 >= this.maxNest,
                }
                return this.loadList(params)
                .then(data=>{
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
                return this.fetchReplyList(this.replyPage)

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
