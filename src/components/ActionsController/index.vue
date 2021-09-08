<template>
    <div >
        <div class="bbs-action-controller">
            <div title="Markdown is supported">
                <a href="https://segmentfault.com/markdown" target="_blank" rel="noopener noreferrer" >
                    <svg className="markdown" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
                        <path fillRule="evenodd" d="M14.85 3H1.15C.52 3 0 3.52 0 4.15v7.69C0 12.48.52 13 1.15 13h13.69c.64 0 1.15-.52 1.15-1.15v-7.7C16 3.52 15.48 3 14.85 3zM9 11H7V8L5.5 9.92 4 8v3H2V5h2l1.5 2L7 5h2v6zm2.99.5L9.5 8H11V5h2v3h1.5l-2.51 3.5z"></path>
                    </svg>
                </a>
            </div>
            <div class="text-right">
                <Emoji :insertEmoji="insertEmoji"/>
                <Button
                        class="bbs-preview-btn text-sm"
                        text
                        :color="preview ? 'success' : '' "
                        @click="togglePreview"
                >
                    预览:{{preview ? 'On' : 'Off'}}
                </Button>
            </div>
        </div>
        <CollapseTransition :duration="500" >
            <PreviewRender v-show="preview" :message="message" />
        </CollapseTransition>
    </div>
</template>

<script>
    import {CollapseTransition} from "vue2-transitions";
    import Button from "../commons/UI/Button";
    import Emoji from "../InfoInput/Emoji";
    import PreviewRender from "./PreviewRender";
    export default {
        name: "ActionsController",
        components: {PreviewRender, Emoji, Button,CollapseTransition},
        props:{
            message:String,
            insertEmoji:Function
        },
        data(){
            return {
                preview:true
            }
        },
        methods:{
            togglePreview(){
                this.preview=!this.preview
            },
        }
    }
</script>

<style scoped>
    .bbs-action-controller{
        display:flex;
        justify-content: space-between;
        align-items: center;
    }
    .bbs-preview-btn{
        padding: 0;
        margin-left:16px;
    }
</style>
