<template>
    <div class="bbs-comment-card">
        <MessageHead :small="small" :details="details" />
        <MessageBody
                :small="small"
                :details="details"
                :needUpdateData="needUpdateData"
                :updateCommentAsync="updateCommentAsync"
                :loadList="loadList"
                :curNest="curNest"
                :maxNest="maxNest"
        />
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
            needUpdateData:Object,
            curNest:Number,
            maxNest:Number,
            loadList:Function,
            updateCommentAsync:Function,
        }
    }
</script>
<style scoped>
    .bbs-comment-card{
        margin:16px 0;
    }
</style>


