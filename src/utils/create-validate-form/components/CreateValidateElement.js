import '../enhance$attr'

import $ from 'jquery'
import {checkIsIgnore, initIgnore} from '../init/ignoreEle'
import copyAttr from '../init/copyAttr'
import ValidateClass from '../ValidateClass'

class CreateValidateElement extends ValidateClass{
  // eslint-disable-next-line constructor-super
  constructor({
    ele = null,
    rules = [],
    material = true,
    showSuccess = true,
  } = {}) {
    super({rules:[rules],eleLength:1,showSuccess})
    if (ele == null) {
      throw new Error('Need to provide a input[text] element')
    }
    // let $ele=$(ele)
    // if($ele.attr('data-cvf')==null){
    //   console.warn('Did not detect the [data-cvf] attribute.')
    //   return
    // }
    this.$ele=$(ele)
    this.elementData = []
    this.infoObj={}
    this.material = material

    this._elementFocus = this._elementFocus.bind(this)
    this._elementBlur= this._elementBlur.bind(this)
  }

  reset(){
    this.elementData.forEach((dataObj,index) => {
      this.isValidates=[]
      this.dirty=[]
      dataObj.reset()
      this._elementBlur(index)
      this.validate_render(dataObj,index)
    })
  }

  validate(){
    this.dirty[0]=true
    let valid=this.validEle(this.elementData[0])
    return valid!==false
  }


  val(){
    return this.elementData[0].result
  }

  init() {
    let $curEle = this.$ele
    if(checkIsIgnore(this,$curEle)){
      initIgnore(this,$curEle)
      return
    }
    let $wrapper = $('<div class="cvf-filedset-wrapper"></div>')
    $wrapper=copyAttr($curEle,$wrapper,null,['class'])
    this._insertEle($wrapper,$curEle,0)
    let removeMessageGap=$curEle.attr('data-cvf-remove-msg-gap')!=null
    if(removeMessageGap)this.elementData[i].$msgEle.css({minHeight:0})
    this.validAll(this.elementData)
  }

  _insertEle($wrapper,$curEle,idx){
    let $tag=$('<span></span>')
    $tag.insertAfter($curEle)
    $curEle.remove()
    $wrapper.insertAfter($tag)
    $tag.remove()
    this.insertElement($wrapper,$curEle,idx)
  }

  insertElement(){}


  bindValidateEvent($curEle,dataObj,idx,showClearBtn,hideClearBtn){
    dataObj.reset=() => {
      $curEle.val('')
      dataObj.result=null
      dataObj.dirty=false
      hideClearBtn()
    }
    setTimeout(() => {
      this._elementBlur(idx)
    },0)
    if(dataObj.isDisabled){
      return
    }
    $curEle.bind('change input paste', () => {
      setTimeout(() => {
        let val=$curEle.val()
        dataObj.result=val
        dataObj.textShow=val
        this.validEle(dataObj)
        if(val==='')hideClearBtn()
        else{
          showClearBtn()
          this._elementFocus(idx)
        }
      },100)
    })
    $curEle.on('focus', () => setTimeout(() => this._elementFocus(idx),0))
    $curEle.on('blur', () => setTimeout(() => this._elementBlur(idx),0))
  }

  addClearBtn($container,$ele,dataObj){
    let $btn=$('<span class="fa fa-times cvf-clear-icon"></span>')
    let idx=dataObj.idx
    $container.append($btn)

    $btn.on('click',() => {
      dataObj.reset()
      $btn.css({display:'none'})
      this.dirty[idx]=false
      this._elementBlur(idx)
    })

    return {
      showClearBtn:() => {
        $btn.css({display:'flex',visibility: 'visible'})
      },
      hideClearBtn:() => {
        $btn.css({display:'none',visibility:'hidden'})
      }
    }
  }

  _elementFocus(index) {
    let {
      textW, $fieldEle, $labelEle, $legendEle
    } = this.elementData[index]
    this.dirty[index] = true
    if($legendEle && $fieldEle){
      $legendEle.css({width: textW})
      $labelEle.css({top: 0, fontSize: 12})
      $fieldEle.addClass('cvf-fieldset-focus')
    }
  }

  _elementBlur(index) {
    let {
      result,$fieldEle, $labelEle, $legendEle, hasPlaceholder
    } = this.elementData[index]
    if(Array.isArray(result)){
      result=result.length===0 ? null : result
    }
    // console.log(result,$labelEle)
    if (!result && !hasPlaceholder) {
      if($legendEle){
        $labelEle.css({top: 14, fontSize: 16})
        $legendEle.css({width: 0})
      }
    }
    if($fieldEle){
      $fieldEle.removeClass('cvf-fieldset-focus')
    }

    this.validEle(this.elementData[index])
  }
}

export default CreateValidateElement
