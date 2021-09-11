<template>
    <section class="serverless-bbs" style="margin-bottom:128px;">
        <ServerlessBBsPanel />
<!--        <div style="height:200px;overflow:auto">-->
<!--            <div style="height:400px;overflow:auto">-->
<!--                <div style="height:300px;overflow:auto"></div>-->
<!--                <div style="height:600px;overflow:auto">-->

<!--                    <div style="height:800px;overflow:auto">-->
<!--                        <div style="height:1000px;overflow:auto">-->

<!--                            <ServerlessBBsPanel />-->

<!--                        </div>-->
<!--                    </div>-->
<!--                    <div style="height:300px;overflow:auto"></div>-->
<!--                </div>-->
<!--            </div>-->
<!--            <div style="height:300px;overflow:auto"></div>-->
<!--        </div>-->

    </section>
</template>

<script>
    import ServerlessBBsPanel from "./components/ServerlessBBsPanel";
    import MessageCard from "./components/CommentList/MessageCard";
    import CommentList from "./components/CommentList/index";
    export default {
        name: "App",
        components: {CommentList, MessageCard, ServerlessBBsPanel},
        data(){
            return {
                val:''
            }
        },
        mounted(){
            console.log(this.$refs['name-field'])
        }
    }
</script>

<style scoped>
    .serverless-bbs{
        max-width:992px;
        margin:auto;
    }
</style>
