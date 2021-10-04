<template>

</template>

<script>

    import ConvertLayer from "./leancloud/ConvertLayer";

    export default {
        name: "Layer",
        extends:ConvertLayer,
        data(){
            return {
                initialLoading:true,
            }
        },
        mounted(){
            this.serverInit()
            .then(()=>this.initialLoading=false)
        },
    }
</script>

<style scoped>

</style>
