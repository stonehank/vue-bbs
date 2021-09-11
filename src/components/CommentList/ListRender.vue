<template>
    <section>
        <div v-for="(details,index) in list"
             :key="details.objectId"
             :id="details.objectId"
        >
            <div class="bbs-hr" v-if="index!==0 && curNest===0" />
            <MessageCard :small="curNest > 0"
                         :details="details"
                         :curNest="curNest"
                         :startReply="startReply"
            >
                <ListRender v-if="details.replyList && details.replyList.length>0"
                            class="mt-2 bbs-reply-wrapper pl-1"
                            :cur-nest="curNest+1"
                            :list="details.replyList"
                            :startReply="startReply"
                />
            </MessageCard>
        </div>
    </section>
</template>

<script>
    import MessageCard from "./MessageCard";
    export default {
        name: "ListRender",
        components: {MessageCard},
        props:{
            list:Array,
            curNest:Number,
            startReply:Function,
        }
    }
</script>

<style scoped>
    .bbs-hr{
        border-top: 1px dashed var(--bbs-text-muted)
    }
    .bbs-reply-wrapper{
        border-left: 1px dashed var(--bbs-text-muted);
    }
</style>
