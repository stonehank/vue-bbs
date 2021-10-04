<template>
    <Button
            :ref="btnUuid"
            dense
            class="position-relative"
            @click.stop="toggleStatus"
            v-bind="$attrs"
            v-on="$listeners"
    >
        <slot></slot>
        <ScaleTransition :duration="500" :origin="origin" >
            <div
                    class="bbs-popup-box"
                    v-show="newShow"
                    :ref="uuid"
                    @click.stop="()=>{}"
                    :style="{
                        top: boxTop + 'px',
                        left: boxLeft + 'px',
                    }"
            >
                <slot name="popup-content"></slot>
            </div>
        </ScaleTransition>
    </Button>
</template>

<script>
    import Button from "./Button";
    import {v4 as uuidv4} from "uuid";
    import {ScaleTransition} from "vue2-transitions";
    export default {
        name: "PopupButton",
        components: {Button,ScaleTransition},
        props:{
          show:Boolean,
        },
        model:{
            prop:'show',
            event:'change'
        },
        watch:{
            show(newV){
                // console.log(newV,this.newShow)
                if(newV!==this.newShow){
                    this.toggleStatus()
                }
            },
            newShow(newV){
                this.$emit('change',newV)
            }
        },
        data(){
            return {
                boxTop:0,
                boxLeft:0,
                uuid:uuidv4(),
                btnUuid:uuidv4(),
                newShow:this.show,
                origin:'top left'
            }
        },
        mounted(){
            document.documentElement.addEventListener('click',this.hide)
        },
        destroyed() {
            document.documentElement.removeEventListener('click',this.hide)
        },
        methods:{
            hide(){
                this.newShow=false
            },
            toggleStatus(){
                if(!this.newShow){
                    this.$emit('before-open')
                }
                this.newShow=!this.newShow
                if(this.newShow){
                    this.calcPopupPos()
                    // console.log($(this.$refs[this.uuid]),$(this.$refs[this.uuid]).width(),{top,left,height, width})
                }

            },
            calcPopupPos(){
                let {top,left,height:btnH, width:btnW}=this.$refs[this.btnUuid].$el.getBoundingClientRect()
                let popEle=this.$refs[this.uuid]
                popEle.style.display='block'
                let popW=popEle.offsetWidth
                let popH=popEle.offsetHeight
                popEle.style.display='none'
                let fromTop=top - 4
                let fromBottom=window.innerHeight - top - btnH - 4
                let fromLeft=left + btnW
                let fromRight=window.innerWidth - left
                let originY='', originX=''
                if(fromTop > popH && fromBottom < popH){
                    this.boxTop = top - 4 - popH
                    originY='bottom'
                }else {
                    this.boxTop = top + btnH + 4
                    originY='top'
                }
                if(fromLeft > popW && fromRight < popW){
                    // console.log(1)
                    this.boxLeft= left + btnW - popW
                    originX='right'
                }else if(fromLeft < popW && fromRight < popW){
                    // console.log(2,fromLeft,fromRight)
                    this.boxLeft= window.innerWidth - popW -4
                    originX= ((left + btnW/2) / window.innerWidth * 100) + '%'
                }else{
                    // console.log(3)
                    this.boxLeft= left
                    originX='left'
                }
                this.origin=originX + ' ' +originY
            }
        }
    }
</script>

<style scoped>
    .bbs-popup-box{
        position:fixed;
        /*border:1px solid var(--bbs-separator-color);*/
        background: var(--bbs-separator-background);
        border-radius:6px;
        min-width:64px;
        min-height:64px;
        padding:4px 0;
        z-index: 99;
    }
</style>
