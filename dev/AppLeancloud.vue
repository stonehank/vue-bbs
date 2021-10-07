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
    import bbs from '../src'
    Vue.use(bbs,{
        appId:"rYWlO5pCuJAiMPhGtmhvAaGv-MdYXbMMI",
        appKey:"SDfR94mcAqIigfFpzMYfKTxT",
        editMode:true,
        serverURLs:"rywlo5pc.api.lncldglobal.com",
        CommentClass:"Comments_dev",
        CounterClass:"Counters_dev",
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
