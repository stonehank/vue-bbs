<template>
    <div>
        <TextField
                :ref="uuid"
                v-model="newVal"
                :outlined="false"
                label="邮箱"
                :rules="[
                    v=>(!v || emailVerify(v)) || '提供一个有效的email'
                ]"
        />
    </div>
</template>

<script>
    import TextField from "../commons/UI/TextField";
    import Validate from "./Validate";
    export default {
        name: "Email",
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
