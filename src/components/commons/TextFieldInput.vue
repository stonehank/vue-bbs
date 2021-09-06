<template>
    <input
            :ref="'text-field-'+uuid"
            class="col-12 col-md-4"
            value=""
            name="nickname"
            placeholder=""
            data-cvf-label="昵称"
    />
</template>

<script>
    import CreateValidateText from '../../utils/create-validate-form/components/CreateValidateText'
    import {v4 as uuidv4} from 'uuid';
    export default {
        name: "TextFieldInput",
        data(){
            return {
                uuid:uuidv4()
            }
        },
        mounted(){
            console.log(this.$refs)
            window.textI=new CreateValidateText({
                ele:this.$refs['text-field-'+this.uuid],
                material:false,
                showSuccess:false,
                rules:[v=>!!v],
                afterValid(data){
                    console.log(data)
                }
            })
        }
    }
</script>

<style scoped>

</style>
