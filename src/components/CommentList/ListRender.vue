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
                         :maxNest="maxNest"
                         :needUpdateData="needUpdateData"
                         :updateCommentAsync="updateCommentAsync"
                         :load-list="loadList"
            />
        </div>
    </section>
</template>

<script>
    import Button from "../commons/UI/Button";
    import MessageCard from "./MessageCard";
    export default {
        name: "ListRender",
        components: {MessageCard, Button},
        props:{
            list:Array,
            curNest:Number,
            maxNest:Number,
            needUpdateData:Object,
            updateCommentAsync:Function,
            loadList:Function,
        }
    }
</script>

<style scoped>
    .bbs-hr{
        border-top: 1px dashed var(--bbs-text-muted)
    }

</style>
