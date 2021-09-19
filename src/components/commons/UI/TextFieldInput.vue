<template>
    <div>
        <input
                :ref="'text-field-'+uuid"
                value=""
                name="nickname"
                v-model="newValue"
                :placeholder="this.placeholder"
                :data-cvf-label="this.label"
        />
    </div>
</template>

<script>
    // import CreateValidateText from '../../../utils/create-validate-form/components/CreateValidateText'
    import CreateValidateText from 'create-validate-form/dist/components/CreateValidateText'
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
            },
            outlined:{
                default:false
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
            this.root=new CreateValidateText({
                ele:this.$refs['text-field-'+this.uuid],
                material:!this.outlined,
                showSuccess:false,
                rules:this.rules,
                afterValid(data){
                    console.log(data)
                }
            })
        },
        methods:{
            reset(){
                return this.root.reset()
            },
            validate(){
                return this.root.validate()
            }
        }
    }
</script>

<style scoped>

</style>
