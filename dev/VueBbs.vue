<template>
    <VueBbs v-bind="$attrs" />
</template>

<script>
    import FirebaseLayer from '../dist/backend/firebase'
    import VueBbs from "../dist/lib/vue-bbs";
    VueBbs.extends.extends=FirebaseLayer
    // console.log(VueBbs)
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
