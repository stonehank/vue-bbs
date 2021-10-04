<template>
    <div class="bbs-cus-filedset-wrapper">
        <div class="bbs-cus-fieldset-container">
            <fieldset ref="field-ref"
                      class="bbs-cus-fieldset-valid-form"
                      :class="{
                        'bbs-cus-material-ui':!outlined,
                        'bbs-cus-bootstrap-ui':outlined,
                        'bbs-cus-error':error===true
                      }"
            >
                <legend ref="legend-ref" class="bbs-cus-fieldset-legend"/>
                <span ref="label-ref"
                      class="bbs-cus-label-text"
                      :class="{
                        'bbs-cus-text-error':error===true
                      }"
                >
                    {{label}}
                </span>
            </fieldset>
            <textarea v-if="rows"
                      ref="input-ref"
                      class="bbs-cus-valid-field"
                      :class="{
                        'auto-height-textarea-root':autoHeight
                      }"
                      :rows="rows"
                      :placeholder="placeholder"
                      v-model="newValue"
                      v-bind="$attrs"
            />

            <input v-else
                   ref="input-ref"
                   class="bbs-cus-valid-field"
                   :placeholder="placeholder"
                   v-model="newValue"
                   v-bind="$attrs"
            />
        </div>
        <div class="error-msg">{{errorMsg}}</div>
    </div>
</template>

<script>
    import {v4 as uuidv4} from 'uuid';
    import '../../../assets/css/textfield/common.scss'
    export default {
        name: "TextField",
        props: {
            value: {
                default: null
            },
            rows: {
                default: null
            },
            label: {
                type: String,
                default: ''
            },
            placeholder: {
                type: String,
                default: ''
            },
            rules: {
                default: () => []
            },
            outlined: {
                default: true
            },
            autoHeight:{
                default:true
            }
        },
        data() {
            return {
                newValue: this.value,
                uuid: uuidv4(),
                error:false,
                errorMsg:null,
                dirty:false,
                labelTextW:0,
            }
        },
        model: {
            prop: 'value',
            event: 'input'
        },
        watch: {
            value(newV) {
                this.newValue = newV
                this.$nextTick(function () {
                    if(!newV){
                        this.validate()
                    }else{
                        this.handleBlur()
                    }
                })
            },
            newValue(newV) {
                this.$emit('input', newV)
            }
        },
        mounted() {
            let labelEle=this.$refs['label-ref']
            let inputEle=this.$refs['input-ref']
            if(this.label===''){
                this.labelTextW=0
            }else{
                this.labelTextW = labelEle.offsetWidth
            }
            if (this.newValue) {
                this.dirty=true
            }
            inputEle.addEventListener('focus', this.handleFocus)
            inputEle.addEventListener('blur', this.handleBlur)
            if (this.autoHeight) {
                this.calcHeight()
                inputEle.addEventListener('input', this.calcHeight)
            }
            this.handleFocus()
            this.dirty=false
            this.handleBlur()
        },
        methods: {
            handleBlur() {
                let legendEle=this.$refs['legend-ref']
                let labelEle=this.$refs['label-ref']
                let fieldEle=this.$refs['field-ref']
                if (!this.newValue && !this.placeholder) {
                    legendEle.style.width = 0
                    labelEle.style.top = '16px'
                    labelEle.style.fontSize = '16px'
                }
                fieldEle.classList.remove('bbs-cus-fieldset-focus')
                if (this.dirty) this.validate()
            },

            handleFocus() {
                let legendEle=this.$refs['legend-ref']
                let labelEle=this.$refs['label-ref']
                let fieldEle=this.$refs['field-ref']
                legendEle.style.width = this.labelTextW + 'px'
                labelEle.style.top = 0
                labelEle.style.fontSize = '12px'
                fieldEle.classList.add('bbs-cus-fieldset-focus')
                this.dirty=true
            },
            calcHeight() {
                let inputEle=this.$refs['input-ref']
                inputEle.style.height = 'auto'
                inputEle.style.height = `${inputEle.scrollHeight + 2}px`
            },
            validate() {
                this.dirty=true
                if(this.rules.length===0){
                    this.error=false
                    this.errorMsg=null
                    return true
                }
                for(let ruleFunc of this.rules){
                    let res=ruleFunc(this.newValue)
                    if(res!==true){
                        this.error=true
                        this.errorMsg=res
                        return false
                    }
                }
                this.error=false
                this.errorMsg=null
                return true
            },
            reset() {
                this.newValue=''
                this.error=false
                this.errorMsg=null
                this.dirty=false
                this.calcHeight()
            },
            getElement(){
                return this.$refs['input-ref']
            }
        }
    }
</script>

<style scoped>

</style>
