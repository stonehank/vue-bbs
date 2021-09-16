<template>
    <section class="serverless-bbs" style="margin-bottom:128px;">
        <ServerlessBBsPanel :nest="winW<600 ? 1 : Infinity" :pageSize="5" />
    </section>
</template>

<script>
    import {writeUserData} from '../draft/serve-test'
    import ServerlessBBsPanel from "./components/ServerlessBBsPanel";
    import MessageCard from "./components/CommentList/MessageCard";
    import CommentList from "./components/CommentList/index";
    export default {
        name: "App",
        components: {CommentList, MessageCard, ServerlessBBsPanel},
        data(){
            return {
                val:'',
                winW:window.innerWidth,
            }
        },
        mounted(){
            console.log(this.$refs['name-field'])
            writeUserData(1,'aaa','aaa@email.com','')
            window.addEventListener('resize',()=>{
                this.winW=window.innerWidth
            })
        }
    }
</script>

<style scoped>
    .serverless-bbs{
        max-width:992px;
        margin:auto;
    }
</style>
