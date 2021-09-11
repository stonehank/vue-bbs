<template>
    <div class="bbs-comment-card">
        <MessageHead :small="small" :details="details" />
        <MessageBody
                :small="small"
                :details="details"
                :startReply="startReply"
        >
            <slot></slot>
        </MessageBody>
    </div>
</template>

<script>
    import MessageHead from "./MessageHead";
    import MessageBody from "./MessageBody";
    export default {
        name: "MessageCard",
        components: { MessageBody, MessageHead},
        props:{
            details:Object,
            small:Boolean,
            curNest:Number,
            startReply:Function,
        }
    }
</script>
<style scoped>
    .bbs-comment-card{
        margin:16px 0;
    }
</style>


