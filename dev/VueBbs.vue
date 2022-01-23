<template>
    <VueBbs v-bind="$attrs" />
</template>

<script>
    // import LeancloudLayer from '../src/layer/leancloud/ConvertLayer'
    import ServerLayer from '../src/layer/firebase/ConvertLayer'
    // import VueBbs from "../src/components/ServerlessBBSPanel";
    import VueBbs from "../src/components/ServerlessBBSPanel";
    import registerServer from "../src/registerServer";
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
