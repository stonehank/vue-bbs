<template>

</template>

<script>

    export default {
        name: "LayerInterface",
        data(){
            return {
                // Detect the app initial is done
                initialLoading:true,
            }
        },
        methods: {
            /**
             * @return Promise
             */
            serverInit(){},
            /**
             * @param uniqStr<String>
             * @return Promise
             */
            fetchPageViews(uniqStr){},
            /**
             * @param uniqStr <String>
             * @return Promise
             */
            fetchCounts(uniqStr){},
            /**
             * @param id<Number>
             * @param message<String>
             * @return Promise
             */
            updateComment(id,message){},
            /**
             *  Upload Object Format
             * {
                at: String,
                avatar: String,
                email:String,
                message: String,
                nickname: String,
                replyId: String,
                rootId: String,
                uniqStr: String,
             * }
             * @param uploadField<Object>
             * @return Promise
             */
            uploadComment(uploadField){},
            /**
             * @return Promise
             */
            fetchCurrentUser(){},
            /**
             * Params Object format
             * {
                uniqStr         // 页面唯一值
                rootId          // rootId， 用于插入嵌套数据
                replyId         // 存在则搜索对应replyId的数据
                page            // 数据页码
                pageSize        // 数据每页条数
                deepReply       // Boolean, 存在则深度搜索每一个回复（嵌套回复）
                deepReplyCounts // Boolean, 存在则深度搜索回复数量
             * }
             * @param params<Object>
             *
             * Output Object Format
             * {
                at: String,
                avatar: String,
                createdAt: String,
                message: String,
                nickname: String,
                objectId: String,
                replyId: String,
                rootId: String,
                updatedAt: String,
                user_id: String,
                replyCounts: Number,
                replys: null
             * }
             * @return Promise
             */
            fetchComments(params){},

        }
    }
</script>

<style scoped>

</style>
