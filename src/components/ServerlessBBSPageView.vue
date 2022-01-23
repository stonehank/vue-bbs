<template>
    <Loading :size="size" v-if="loading || initialLoading" />
    <span v-else>{{counts}}</span>
</template>

<script>
    import Loading from "./commons/Loading";
    import '../assets/css/common.scss'
    import LayerInterface from "../layer/LayerInterface";
    export default {
        name: "ServerlessBBSPageView",
        components: {Loading},
        extends:LayerInterface,
        props:{
            uniqStr:{
                type:String,
                default:window.location.origin+window.location.pathname
            },
            size:{
                default:16
            }
        },
        data(){
            return {
                loading:true,
                counts:0
            }
        },
        watch:{
            initialLoading:{
                immediate:true,
                handler(newV){
                    if(!newV){
                        this.init()
                    }
                }
            }
        },
        methods:{
            init(){
                this.loadCounter({rootId:''})
                .then((count)=>this.counts=count)
                .finally(()=>this.loading=false)
            },
            loadCounter(){
                return this.fetchPageViews(this.uniqStr,'Vue测试主页')
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
