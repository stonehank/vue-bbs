<template>
    <input
            :ref="'text-field-'+uuid"
            value=""
            name="nickname"
            v-model="newValue"
            :placeholder="this.placeholder"
            :data-cvf-label="this.label"
    />
</template>

<script>
    import CreateValidateText from '../../../utils/create-validate-form/components/CreateValidateText'
    import {v4 as uuidv4} from 'uuid';
    export default {
        name: "TextFieldInput",
        props:{
            value:{
                default:null
            },
            label:{
                type:String,
                default:'昵称'
            },
            placeholder:{
                type:String,
                default:''
            },
            rules:{
                default:()=>[v=>!!v || '昵称必须填写']
            }
        },
        data(){
            return {
                newValue:this.value,
                uuid:uuidv4()
            }
        },
        model:{
            prop:'value',
            event:'input'
        },
        watch:{
            value(newV){
                this.newValue=newV
            },
            newValue(newV){
                this.$emit('input',newV)
            }
        },
        mounted(){
            this.root=new CreateValidateText({
                ele:this.$refs['text-field-'+this.uuid],
                material:false,
                showSuccess:false,
                rules:this.rules,
                afterValid(data){
                    console.log(data)
                }
            })
        },
        methods:{
            validate(){
                this.root.validate()
            }
        }
    }
</script>

<style scoped>

</style>
