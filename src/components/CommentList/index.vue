<template>
    <div class="text-center" v-if="loading || userLoading">
        <Loading :size="48" />
    </div>
    <section v-else>
        <p class="text-md">
            评论数：<span>{{total > 999 ? '999+' : total}}</span>
        </p>
        <ListRender
                :curNest="0"
                :maxNest="maxNest"
                :needUpdateData="needUpdateData"
                :updateCommentAsync="updateCommentAsync"
                :list="list"
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
        provide(){
            return {
                updateCommentAsync:this.updateCommentAsync
            }
        },
        inject:['fetchCurrentUser'],
        props:{
            uniqStr:{
                type:String,
                default:window.location.origin+window.location.pathname
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
            fetchComments:Function,
        },
        watch:{
            needUpdateData(newV){
              // console.log('needUpdate')
                if(!newV)return
                this.loadData()
            },
            maxNest(){
                this.reload()
            },
            pageSize(){
                this.reload()
            }
        },
        data(){
            return {
                loading:true,
                userLoading:true,
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
            this.init()
            document.addEventListener('click',bindATagSmoothScroll)
        },
        destroyed() {
            document.removeEventListener('click',bindATagSmoothScroll)
        },
        methods:{
            init(){
                // console.log('start load list')
                this.loading=true
                this.userLoading=true
                this.loadData()
                this.fetchCurrentUser()
                .finally(()=>this.userLoading=false)
            },
            loadData(){
                return this.loadList({
                    page:this.page,
                    deepReply:this.maxNest <=0,
                    deepReplyCounts:this.maxNest <= 1,
                })
                .then(({data,total})=>{
                    this.list=cloneDeep(data)
                    // this.total=data.length
                    this.total=this.$serverLessBBS.countMap.has(this.uniqStr)
                        ? this.$serverLessBBS.countMap.get(this.uniqStr)
                        : total
                    this.noMoreData=data.filter(obb=>obj.replyId==null).length>=total
                })
                .finally(()=>this.loading=false)
            },
            reload(){
                this.page=1
                this.list=[]
                this.loading=true
                this.loadData()
            },
            loadList(parameters){
                let params={
                    uniqStr:this.uniqStr,
                    pageSize:this.pageSize,
                    ...parameters
                }
                return this.fetchComments(params)
            },
            loadMore(){
                this.page+=1
                return this.loadData()
            },
            updateCommentAsync(id,editData){
                let data=this.list.find(obj=>obj.objectId===id)
                if(data){
                    data.message=editData.message
                    data.updatedAt=editData.updatedAt
                }
            }
        }
    }
</script>

<style scoped>

</style>
