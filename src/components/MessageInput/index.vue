<template>
    <div>
        <TextField
                :rows="$attrs.rows || 5"
                :ref="uuid"
                :label="$attrs.label || '说点什么吧'"
                :placeholder="$attrs.placeholder || ''"
                :rules="$attrs.rules || [v=>!!v || '内容不能为空']"
                v-model="newVal"
                v-bind="$attrs"
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
        mounted(){
            console.log(this,'msg input')
        }
    }
</script>

<style scoped>

</style>
