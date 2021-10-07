<template>

</template>

<script>

    import LayerInterface from "./LayerInterface";

    export default {
        name: "Layer",
        extends:LayerInterface,
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
