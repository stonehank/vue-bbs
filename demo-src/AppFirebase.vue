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
    import FirebaseServer from '../src/layer/firebase/ConvertLayer'
    Vue.use(bbs,{
        editMode:true,
        CommentClass:"Comments_demo",
        CounterClass:"Counters_demo",
        apiKey: 'AIzaSyAQTct1trRnIB7QLE9RZ6qZgHGahVNrvco',
        projectId: 'servelessbbs',
        server:FirebaseServer
    })
    export default {
        name: "AppFirebase",
        props:{
            nest:Number,
            pageSize:Number,
        }
    }
</script>

<style scoped>

</style>
