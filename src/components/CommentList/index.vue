<template>
    <div class="text-center" v-if="loading">
        <Loading  :size="48" />
    </div>
    <section v-else>
        <p class="text-md">
            评论数：
            <ServerlessBBsCounter :uniqStr="uniqStr" />
        </p>
        <ListRender
                :curNest="0"
                :maxNest="maxNest"
                :list="list"
                :startReply="startReply"
                :loadList="loadList"
        />
        <MoreButton
                :nodata="nodata"
                :loadMore="loadMore"
        />
    </section>
</template>

<script>
    import MessageCard from "./MessageCard";
    import ListRender from "./ListRender";
    import Button from "../commons/UI/Button";
    import MoreButton from "./MoreButton";
    import {fetchComments, fetchCounts} from "../../utils/API-Core";
    import ServerlessBBsCounter from "../ServerlessBBsCounter";
    import cloneDeep from "clone-deep";
    import bindATagSmoothScroll from "../../utils/DOM/bindATagSmoothScroll";
    import Loading from "../commons/Loading";
    export default {
        name: "CommentList",
        components: {Loading, ServerlessBBsCounter, MoreButton, Button, ListRender, MessageCard},
        props:{
            uniqStr:{
                type:String,
                default:window.location.pathname + window.location.hash
            },
            pageSize:{
                type:Number,
                default:10
            },
            editable:Boolean,
            maxNest:{
                default:1
            },
            startReply:Function
        },
        watch:{
            maxNest(newV){
                console.log('nest change ',newV)
                this.page=1
                this.list=[]
                this.loadData()
            }
        },
        data(){
            return {
                loading:true,
                page:1,
                list:[],
                nodata:false,
            }
        },
        mounted(){
            /** 流程
             * 获取数据-> 回复
             * 获取数据-> count
             * 根据maxNest，editable, pageSize，分页方式进行渲染
             * */
            this.loadData()
            document.addEventListener('click',bindATagSmoothScroll)
        },
        destroyed() {
            document.removeEventListener('click',bindATagSmoothScroll)
        },
        methods:{
            loadData(){
                this.loading=true
                this.loadList({
                    page:this.page,
                    deepReply:this.maxNest <=0 ? 0 : null,
                    deepReplyCounts:this.maxNest <= 1,
                })
                .then((data)=>this.list=data)
                .finally(()=>this.loading=false)
            },
            loadList(parameters){
                let params={
                    uniqStr:this.uniqStr,
                    pageSize:this.pageSize,
                    ...parameters
                }
                return fetchComments(params)
            },
            loadMore(){
                this.page+=1
                return this.loadList({
                    page:this.page,
                    deepReply:this.maxNest <=0 ? 0 : null,
                    deepReplyCounts:this.maxNest <= 1
                })
                .then((data)=>{
                    if(data.length===0){
                        this.nodata=true
                    }else{
                        this.list=cloneDeep(data)
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
