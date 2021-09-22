<template>
    <div>
        <TextFieldInput
                :ref="uuid"
                v-model="newVal"
                :outlined="false"
                label="个人网址"
                :rules="[
                    v=>(!v || linkVerify(v)) || '提供一个有效的URL'
                ]"
        />
    </div>
</template>

<script>
    import TextFieldInput from "../commons/UI/TextField";
    import Validate from "./Validate";
    export default {
        name: "Link",
        components: {TextFieldInput},
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
