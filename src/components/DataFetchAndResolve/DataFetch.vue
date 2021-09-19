<template>

</template>

<script>
    /**
     * Vue -> $serverLessBBS
     * appId
     * appKey
     * serverURLs
     * CommentClass
     * CounterClass
     */
    import LeanCloudAV from '../LeanCloudAV/index'
    export default {
        name: "DataFetch",
        extends:LeanCloudAV,
        methods: {

            fetchDataFromServer(uniqStr) {
                return this.leancloud_fetchListFrom(uniqStr)
            },
            fetchCountFromServer(uniqStr) {
                return this.leancloud_fetchCommentCount(uniqStr)
            },
            fetchViewFromServer(uniqStr,title) {
                return this.leancloud_getPageview(uniqStr,title)
            },
            uploadMessageToServer(uploadField){
                return this.leanCloud_uploadComment(uploadField)
            }
        }

    }
</script>

<style scoped>

</style>
