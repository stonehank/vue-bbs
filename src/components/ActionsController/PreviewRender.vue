<template>
    <div
         class="markdown-body bbs-preview-render"
         v-html="previewMessage.trim()==='' ? `<span class='text-muted'>无内容</span>` : previewMessage"
    >
    </div>
</template>

<script>
    import { xssMarkdown} from "../../utils/String";
    import {renderAtMessage} from "../../utils/handlerAtTag";
    export default {
        name: "PreviewRender",
        props:{
            preview:Boolean,
            message:String,
            replyId:String,
            at:String,
        },
        computed:{
            previewMessage(){
                if(!this.preview)return ''
                return xssMarkdown(renderAtMessage(this.message,this.replyId,this.at))
            }
        }
    }
</script>

<style scoped>
    .bbs-preview-render{
        /*min-height: 48px;*/
        padding: 8px;
        font-size: 16px;
        background: var(--bbs-background-color);
        border: 1px dashed var(--bbs-separator-color);
        border-radius: 4px;
    }
</style>
