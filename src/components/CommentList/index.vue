<template>
    <div class="text-center" v-if="loading">
        <Loading  :size="48" />
    </div>
    <section v-else>
        <p class="text-md">
            评论数：<span>{{total > 999 ? '999+' : total}}</span>
        </p>
        <ListRender
                :curNest="0"
                :maxNest="maxNest"
                :needUpdateData="needUpdateData"
                :list="list"
                :startReply="startReply"
                :loadList="loadList"
        />
        <p class="text-center text-secondary" v-if="noMoreData && list.length===0">还没有任何评论~</p>
        <MoreButton
                v-else
                :noMoreData="noMoreData"
                :loadMore="loadMore"
        />
    </section>
</template>

<script>
    import MessageCard from "./MessageCard";
    import ListRender from "./ListRender";
    import Button from "../commons/UI/Button";
    import MoreButton from "./MoreButton";
    import cloneDeep from "clone-deep";
    import bindATagSmoothScroll from "../../utils/DOM/bindATagSmoothScroll";
    import Loading from "../commons/Loading";
    export default {
        name: "CommentList",
        components: {Loading, MoreButton, Button, ListRender, MessageCard},
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
            needUpdateData:Object,
            maxNest:{
                default:1
            },
            startReply:Function,
            fetchResolveComments:Function,
        },
        watch:{
            needUpdateData(newV){
              console.log('needUpdate')
                if(!newV)return
                this.loadData()
            },
            maxNest(newV){
                console.log('nest change ',newV)
                this.page=1
                this.list=[]
                this.loading=true
                this.loadData()
            }
        },
        data(){
            return {
                loading:true,
                page:1,
                list:[],
                total:null,
                noMoreData:true,
            }
        },
        mounted(){
            /** 流程
             * 获取数据-> 回复
             * 获取数据-> count
             * 根据maxNest，editable, pageSize，分页方式进行渲染
             * */
            console.log(this)
            this.init()
            document.addEventListener('click',bindATagSmoothScroll)
        },
        destroyed() {
            document.removeEventListener('click',bindATagSmoothScroll)
        },
        methods:{
            init(){
                console.log('start load list')
                this.loading=true
                this.loadData()
            },
            loadData(){
                return this.loadList({
                    page:this.page,
                    deepReply:this.maxNest <=0 ? 0 : null,
                    deepReplyCounts:this.maxNest <= 1,
                })
                .then(({data,total})=>{
                    this.list=cloneDeep(data)
                    this.total=this.$serverLessBBS.countMap.has(this.uniqStr)
                        ? this.$serverLessBBS.countMap.get(this.uniqStr)
                        : total
                    // this.total=total
                    this.noMoreData=data.length>=total
                })
                .finally(()=>this.loading=false)
            },
            loadList(parameters){
                let params={
                    uniqStr:this.uniqStr,
                    pageSize:this.pageSize,
                    ...parameters
                }
                return this.fetchResolveComments(params)
            },
            loadMore(){
                this.page+=1
                return this.loadData()
            }
        }
    }
</script>

<style scoped>

</style>
