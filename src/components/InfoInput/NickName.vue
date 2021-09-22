<template>
    <div>
        <TextField
                :ref="uuid"
                v-model="newVal"
                :outlined="false"
                label="昵称"
                :rules="[v=>!!v || '昵称必须填写']"
        />
    </div>
</template>

<script>
    import TextField from "../commons/UI/TextField";
    import Validate from "./Validate";
    export default {
        name: "NickName",
        components: {TextField},
        extends:Validate,
        props:{
            value:String,
        },
        model:{
            prop:'value',
            event:'input'
        },
        watch:{
            value(newV){
                this.newVal=newV
            },
            newVal(newV){
                this.$emit('input',newV)
            }
        },
        data(){
            return {
                newVal:this.value
            }
        },
    }
</script>

<style scoped>

</style>
