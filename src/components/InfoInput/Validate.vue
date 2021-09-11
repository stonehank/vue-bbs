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
                console.log('validate')
                return this.$refs[this.uuid].validate()
            },
            getElement(){
                return this.$refs[this.uuid].$el
            }
        }
    }
</script>

<style scoped>

</style>
