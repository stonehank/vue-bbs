<template>
    <section class="serverless-bbs">
<!--        <ServerlessBBsCounter />-->
<!--        <ServerlessBBsViewer />-->
        <ServerlessBBsPanel />
    </section>
</template>

<script>
    import ServerlessBBsPanel from "./components/ServerlessBBsPanel";
    export default {
        name: "App",
        components: {ServerlessBBsPanel},
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
