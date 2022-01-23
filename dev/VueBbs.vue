<template>
    <VueBbs v-bind="$attrs" />
</template>

<script>
    // import LeancloudLayer from '../src/layer/leancloud/ConvertLayer'
    import ServerLayer from '../dist/backend/firebase'
    // import VueBbs from "../src/components/ServerlessBBSPanel";
    import VueBbs from "../dist/lib/vue-bbs";
    import registerServer from "../dist/registerServer";
    registerServer(VueBbs,ServerLayer)
    export default {
        inheritAttrs:false,
        name: "VueBBSPanel",
        components:{
            VueBbs
        }
    }
</script>

<style scoped>

</style>
