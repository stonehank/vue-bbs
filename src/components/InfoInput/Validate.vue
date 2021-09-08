<template>

</template>

<script>
    import {v4 as uuidv4} from 'uuid'
    export default {
        name: "Validate",
        data(){
            return {
                uuid:uuidv4(),
            }
        },
        methods:{
            validate(){
                return this.$refs[this.uuid].validate()
            }
        }
    }
</script>

<style scoped>

</style>
