<template>
    <div>
        <span>评论数：<vue-bbs-counter /></span>
        <span>页面浏览量：<vue-bbs-pageview /></span>
        <vue-bbs
                :nest="nest"
                :pageSize="pageSize"
                :editable="false"
        />
    </div>
</template>

<script>
    import Vue from 'vue'
    import bbs from '../dist'
    Vue.use(bbs,{
        appId:"rYWlO5pCuJAiMPhGtmhvAaGv-MdYXbMMI",
        appKey:"SDfR94mcAqIigfFpzMYfKTxT",
        editMode:true,
        serverURLs:"rywlo5pc.api.lncldglobal.com",
        CommentClass:"Comments_demo",
        CounterClass:"Counters_demo",
    })
    export default {
        name: "AppLeancloud",
        props:{
            nest:Number,
            pageSize:Number,
        }
    }
</script>

<style scoped>

</style>
