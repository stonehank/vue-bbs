/*
* Require : jquery
* Require : juqery.mask
* */
import $ from 'jquery'
import {checkIsSubmit} from './init/submitBtn'
import {checkIsIgnore, initIgnore} from './init/ignoreEle'
import copyAttr from './init/copyAttr'
import ValidateClass from './ValidateClass'
import createTextFieldHtmlObj from './insert/createTextFieldHtmlObj'
import createCheckboxHtmlObj from './insert/checkbox/createCheckboxHtmlObj'
import createCheckboxInside from './insert/checkbox/createCheckboxInside'
import createInputInside from './insert/input/createInputInside'
import createPasswordInputInside from './insert/input/createPasswordInputInside'
import createSelectInside from './insert/select/createSelectInside'
import createTextareaInside from './insert/textarea/createTextareaInside'
import createDateTimeInside from './insert/datetime/createDateTimeInside'
import createFileInside from './insert/file/createFileInside'
import createGallery from './insert/file/createGallery'
import createRadioHtmlObj from './insert/radio/createRadioHtmlObj'
import createRadioInside from './insert/radio/createRadionside'


class CreateValidateForm extends ValidateClass{
  constructor({
    ele = null,
    rules = [],
    material = true,
    showSuccess = true,
    otpOptions={},
    uploadOptions={},
    // eslint-disable-next-line  no-unused-vars
    afterValid = (data) => {
    },
  } = {}) {
    if (ele == null) throw new Error('Need to provide a element')
    let $ele=$(ele)
    let $children=$ele.find('[data-cvf]')
    let len=$children.length
    super({rules,eleLength:len,showSuccess})
    this.$children = $children
    this.len = len
    this.elementData = []
    this.$ele=$ele
    this.infoObj={}
    this.submitBtn = null
    this.material = material
    this.afterValid = afterValid
    this.showDropDownIdx=null
    this.showDropDownEle=null
    this.otpOptions=otpOptions
    this.uploadOptions=uploadOptions
    this.submitBtn=$ele.find('[data-cvf-submit]')
    $ele.addClass('row cvf-from')

    this._elementFocus = this._elementFocus.bind(this)
    this._elementBlur= this._elementBlur.bind(this)

    $ele[0].reset=() => {
      this.elementData.forEach((dataObj,index) => {
        this.isValidates=[]
        this.dirty=[]
        // console.log(dataObj)
        dataObj.reset()
        this._elementBlur(index)
        this.validate_render(dataObj,index)
      })
    }
    this.init()
  }

  preventTouch($ele){
    if(PointerEvent){
      $ele.on('pointerdown',false)
    }else{
      $ele.addEventListener('touchstart', false)
      $ele.addEventListener('mousedown', false)
    }
  }

  init() {
    for (let i = 0; i < this.$children.length; i++) {
      let $curEle = this.$children.eq(i)
      let $wrapper = $('<div class="cvf-filedset-wrapper"></div>')
      if(checkIsSubmit(this,$curEle)){
        // initSubmit(this,$curEle)
        continue
      }
      if(checkIsIgnore(this,$curEle)){
        initIgnore(this,$curEle)
        continue
      }
      $wrapper=copyAttr($curEle,$wrapper,null,['class'])
      this._insertEle($wrapper,$curEle,i)
      let removeMessageGap=$curEle.attr('data-cvf-remove-msg-gap')!=null
      if(removeMessageGap)this.elementData[i].$msgEle.css({minHeight:0})
    }
    this._submitEvent()
    this.validAll(this.elementData)
  }

  _insertEle($wrapper,$curEle,idx){
    let $tag=$('<span></span>')
    $tag.insertAfter($curEle)
    $curEle.remove()
    $wrapper.insertAfter($tag)
    $tag.remove()
    let type=$curEle.attr('type')
    switch($curEle[0].nodeName){
      case 'INPUT':
        if(type==null || type==='text'){
          this.insertTextInput($wrapper,$curEle,idx)
        }else if(type==='password'){
          this.insertPasswordInput($wrapper,$curEle,idx)
        }else if(type==='checkbox'){
          this.insertCheckbox($wrapper,$curEle,idx)
        }else if(type==='radio'){
          this.insertRadio($wrapper,$curEle,idx)
        }else if(type==='date'){
          this.insertDateTime($wrapper,$curEle,idx,'date')
        }else if(type==='time'){
          this.insertDateTime($wrapper,$curEle,idx,'time')
        }else if(type==='datetime-local' || type==='datetime'){
          this.insertDateTime($wrapper,$curEle,idx,'datetime')
        }else if(type==='file'){
          this.insertFileInput($wrapper,$curEle,idx)
        }
        break
      case 'SELECT':
        this.insertSelect($wrapper,$curEle,idx)
        break
      case 'TEXTAREA':
        this.insertTextarea($wrapper,$curEle,idx)
        break
      default:
        if($curEle.attr('data-cvf-type')==='radio'){
          this.insertRadio($wrapper,$curEle,idx,true)
        }
        break
    }
  }


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

  insertDateTime($wrapper,$curEle,idx,type){
    const [$container,dataObj]=createTextFieldHtmlObj(this,{$wrapper,$curEle,idx})
    createDateTimeInside(this,{
      $curEle,
      $container,
      dataObj,
      idx,
      type,
    })
  }

  insertTextarea($wrapper,$curEle,idx){
    const [$container,dataObj]=createTextFieldHtmlObj(this,{$wrapper,$curEle,idx})
    createTextareaInside(this,{
      $curEle,$container,dataObj,idx
    })
  }

  insertCheckbox($wrapper,$curEle,idx){
    const [$container,dataObj]=createCheckboxHtmlObj(this,{$wrapper,$curEle,idx})
    createCheckboxInside(this,{
      $curEle,$container,dataObj,idx
    })
  }

  insertRadio($wrapper,$curEle,idx,isGroup=false){
    const [$container,dataObj]=createRadioHtmlObj(this,{
      $wrapper,$curEle,idx,isGroup
    })
    createRadioInside(this,{
      $curEle,$container,dataObj,idx
    })
  }

  insertFileInput($wrapper,$curEle,idx){
    if(this.uploadOptions.thumbnail){
      createGallery()
    }
    const [$container,dataObj]=createTextFieldHtmlObj(this,{$wrapper,$curEle,idx})
    createFileInside(this,{
      $curEle,$container,dataObj,idx,uploadOptions:this.uploadOptions
    })
  }

  insertPasswordInput($wrapper,$curEle,idx){
    const [$container,dataObj]=createTextFieldHtmlObj(this,{$wrapper,$curEle,idx})
    createPasswordInputInside(this,{
      $curEle,$container,dataObj,idx
    })
  }

  insertTextInput($wrapper,$curEle,idx){
    let curOtpOptions=null
    let otpName=$curEle.attr('data-cvf-otp-name')
    if(otpName!=null){
      curOtpOptions=this.otpOptions[otpName]
    }
    const [$container,dataObj]=createTextFieldHtmlObj(this,{
      $wrapper,$curEle,idx,otpOptions:curOtpOptions
    })
    createInputInside(this,{
      $curEle,$container,dataObj,idx,otpOptions:curOtpOptions
    })
  }

  insertSelect($wrapper,$curEle,idx){
    const [$container,dataObj]=createTextFieldHtmlObj(this,{$wrapper,$curEle,idx})
    createSelectInside(this,{
      $curEle,$container,dataObj,idx
    })
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

  _submitEvent(){
    if (this.submitBtn) {
      this.submitBtn.on('click', (ev) => {
        this.dirty=Array(this.len).fill(true)
        this.validAll(this.elementData)
        this.elementData.forEach((obj) => {
          this.infoObj[obj.key] = obj.result
        })
        // console.log(this.allValid)
        if (this.allValid) this.afterValid(ev,this.infoObj)
        else ev.preventDefault()
      })
    }
  }
}

export default CreateValidateForm
