<template>

</template>

<script>
    import {v4 as uuidv4} from 'uuid'
    import {emailVerify,linkVerify} from '../../utils/Verify';
    export default {
        name: "Validate",
        data(){
            return {
                uuid:uuidv4(),
            }
        },
        computed:{
            emailVerify:()=>emailVerify,
            linkVerify:()=>linkVerify,
        },
        methods:{
            validate(){
                return this.$refs[this.uuid].validate()
            },
            getElement(){
                return this.$refs[this.uuid].$el
            },
            reset(){
                return this.$refs[this.uuid].reset()
            }
        }
    }
</script>

<style scoped>

</style>
