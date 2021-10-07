<template>
    <Loading :size="size" v-if="loading || initialLoading" />
    <span v-else>{{counts}}</span>
</template>

<script>
    import Layer from "../layer";
    import Loading from "./commons/Loading";
    import '../assets/css/common.scss'
    export default {
        name: "ServerlessBBSCounter",
        components: {Loading},
        extends:Layer,
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
                counts:0,
                loopTimer:null
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
        mounted(){
            this.loopTimer=setInterval(()=>{
                this.counts=this.$serverLessBBS.countMap.get(this.uniqStr)
            },1000)
        },
        destroyed() {
            clearInterval(this.loopTimer)
        },
        methods:{
            init(){
                this.loadCounter({rootId:''})
                .then((count)=>this.counts=count)
                .finally(()=>this.loading=false)
            },
            loadCounter(){
                return this.fetchCounts(this.uniqStr)
            },
        }
    }
</script>
