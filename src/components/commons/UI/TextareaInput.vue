<template>
    <textarea
            :ref="'textarea-'+uuid"
            name="message"
            v-model="newValue"
            :rows="this.rows"
            :placeholder="this.placeholder"
            :data-cvf-label="this.label"
    ></textarea>
</template>

<script>
    // import CreateValidateTextarea from '../../../utils/create-validate-form/components/CreateValidateTextarea'
    import CreateValidateTextarea from 'create-validate-form/dist/components/CreateValidateTextarea'
    import {v4 as uuidv4} from 'uuid';
    export default {
        name: "TextareaInput",
        props:{
            value:{
                default:null
            },
            rows:{
                default:5
            },
            label:{
                type:String,
                default:'内容'
            },
            placeholder:{
                type:String,
                default:'说点什么吧'
            },
            rules:{
                default:()=>[v=>!!v || '内容不能为空']
            },
            outlined:{
                default:true
            }
        },
        data(){
            return {
                newValue:this.value,
                uuid:uuidv4(),
                root:null,
            }
        },
        model:{
            prop:'value',
            event:'input'
        },
        watch:{
            value(newV){
                this.newValue=newV
                this.$nextTick(function () {
                    this.validate()
                })
            },
            newValue(newV){
                this.$emit('input',newV)
            }
        },
        mounted(){
            this.root=new CreateValidateTextarea({
                ele:this.$refs['textarea-'+this.uuid],
                material:!this.outlined,
                showSuccess:false,
                rules:this.rules,
                afterValid(data){
                    console.log(data)
                }
            })
        },
        methods:{
            validate(){
                return this.root.validate()
            }
        }
    }
</script>

<style scoped>

</style>
