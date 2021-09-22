<template>
    <section class="bbs-wrapper">
        <span>评论数：<vue-bbs-counter /></span>
<!--        <span>页面浏览量：<vue-bbs-pageview /></span>-->
        <vue-bbs
                :nest="winW<600 ? 1 : Infinity"
                :pageSize="50"
                :editable="false"
        />
    </section>
</template>

<script>
    import VueBbsCounter from '../src/components/ServerlessBBSCounter'
    import VueBbs from '../src/components/ServerlessBBSPanel'
    // import VueBbsCounter from '../dist/vue-bbs-counter'
    // import VueBbs from '../dist/vue-bbs'
    export default {
        name: "App",
        components:{
            VueBbsCounter,
            VueBbs
        },
        data(){
            return {
                val:'',
                winW:window.innerWidth,
            }
        },
        mounted(){
            window.addEventListener('resize',()=>{
                this.winW=window.innerWidth
            })
        }
    }
</script>

<style scoped>
    .bbs-wrapper{
        max-width:992px;
        margin:auto auto 128px auto;
    }
</style>
