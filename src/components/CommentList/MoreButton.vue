<template>
    <div :class="'text-'+align" >
        <Loading v-if="moreLoading" :size="48" />
        <Button v-else
                :disabled="noMoreData"
                :text="noMoreData || simple"
                :color="noMoreData ? 'secondary' : 'info'"
                :dense="simple"
                @click="load"
        >
            {{ noMoreData ? '没有更多了' : '查看更多' }}
        </Button>
    </div>
</template>

<script>
    import Button from "../commons/UI/Button";
    import Loading from "../commons/Loading";
    export default {
        name: "MoreButton",
        components: {Loading, Button},
        props:{
            noMoreData:Boolean,
            simple:Boolean,
            loadMore:Function,
            align:{
                default:'center'
            }
        },
        data(){
            return {
                moreLoading:false
            }
        },
        methods:{
            load(){
                this.moreLoading=true
                this.loadMore()
                .finally(()=>this.moreLoading=false)
            }
        }
    }
</script>

<style scoped>

</style>
