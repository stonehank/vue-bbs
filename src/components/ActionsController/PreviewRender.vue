<template>
    <div class="markdown-body bbs-preview-render"
         v-html="previewMessage.trim()==='' ? `<span class='text-muted'>无内容</span>` : previewMessage"
    >
    </div>
</template>

<script>
    import {replaceAtToTag, xssMarkdown} from "../../utils/String";
    export default {
        name: "PreviewRender",
        props:{
            message:String,
        },
        computed:{
            previewMessage(){
                return xssMarkdown(replaceAtToTag(this.message))
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
