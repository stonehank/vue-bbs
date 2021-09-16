<template>
    <span>{{counts}}</span>
</template>

<script>
    import {fetchCounts} from "../utils/API-Core";
    export default {
        name: "ServerlessBBsCounter",
        props:{
            uniqStr:{
                type:String,
                default:window.location.pathname + window.location.hash
            }
        },
        data(){
            return {
                counts:0
            }
        },
        mounted(){
            this.loading=true
            this.loadCounter({rootId:''})
            .then((count)=>this.counts=count)
            .finally(()=>this.loading=false)
        },
        methods:{
            loadCounter(parameters){
                let params={
                    rootId:parameters.rootId,
                    replyId:parameters.replyId,
                    uniqStr:this.uniqStr,
                    aboveNest:parameters.aboveNest
                }
                return fetchCounts(params)
            },
        }
    }
</script>

<style scoped lang="scss">
    .bbs-input-box{
        display:flex;
        align-items: flex-end;
        justify-content: flex-start;
        flex-flow:wrap;
    }
    .bbs-name-avatar{
        display:flex;
        align-items: flex-end;
        justify-content: flex-start;
        flex-flow:nowrap;
    }
    .bbs-input{
        position: relative;
        margin:0;
        width:100%;
        @media (min-width:768px){
            flex:1;
            min-width:200px;
            margin:0 24px 0 0;
            &:last-child{
                margin:0;
            }
        }
    }
</style>
