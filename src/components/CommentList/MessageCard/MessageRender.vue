<template>
    <div class="markdown-body"
         ref="render-message"
         :class="{
            'expand':showExpandBtn
         }"
         @click="showExpand"
         v-html="renderMessage" >

    </div>
</template>

<script>
    import {replaceAtToTag, xssMarkdown} from "../../../utils/String";

    export default {
        name: "MessageRender",
        props:{
            details:Object,
        },
        data(){
            return {
                showExpandBtn:false
            }
        },
        mounted(){
            let renderEle=this.$refs['render-message']
            if(renderEle.offsetHeight>220){
                this.showExpandBtn=true
            }

        },
        computed:{
            renderMessage(){
                return xssMarkdown(replaceAtToTag(this.details.message,this.details.replyId,this.details.at))
            }
        },
        methods:{
            showExpand(){
                if(!this.showExpandBtn)return
                this.showExpandBtn=false
            }
        }
    }
</script>

<style scoped lang="scss">
    .expand {
        cursor: pointer;
        max-height: 220px;
        overflow: hidden;
        &:before {
            display: block;
            content: "";
            position: absolute;
            width: 100%;
            left: 0;
            top: 0;
            bottom: 3.15rem;
            pointer-events: none;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0), var(--bbs-background-color));
        }
        &:after {
            display: block;
            content: "--- Expand ---";
            text-align: center;
            color: var(--bbs-text-secondary);
            position: absolute;
            width: 100%;
            height: 52px;
            line-height: 52px;
            left: 0;
            bottom: 0;
            pointer-events: none;
            background: var(--bbs-background-color);
        }
    }
</style>
