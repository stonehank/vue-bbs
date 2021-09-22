<template>
    <div>
        <TextField
                :rows="5"
                :ref="uuid"
                label="说点什么吧"
                placeholder=""
                :rules="[v=>!!v || '内容不能为空']"
                v-model="newVal"
        />
    </div>
</template>

<script>
    import TextField from "../commons/UI/TextField";
    import Validate from "../InfoInput/Validate";
    export default {
        name: "MessageInput",
        extends:Validate,
        components: {TextField},
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
                newVal:this.value,
            }
        },
    }
</script>

<style scoped>

</style>
