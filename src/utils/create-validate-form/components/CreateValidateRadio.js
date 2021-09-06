
import CreateValidateElement from './CreateValidateElement'
import createRadioHtmlObj from '../insert/radio/createRadioHtmlObj'
import createRadioInside from '../insert/radio/createRadionside'


class CreateValidateRadio extends CreateValidateElement{
  constructor({
    ele = null,
    rules = [],
    material = true,
    showSuccess = true,
  } = {}) {
    super({
      ele,
      rules,
      material,
      showSuccess,
    })
    this.init()
  }
  
  insertElement($wrapper,$curEle,idx){
    let isGroup=false
    let nodeName=$curEle[0].nodeName
    if(nodeName==='INPUT' && $curEle.attr('type')==='radio'){
      isGroup=false
    }else if(nodeName!=='INPUT' && $curEle.attr('data-cvf-type')==='radio'){
      isGroup=true
    }
    const [$container,dataObj]=createRadioHtmlObj(this,{
      $wrapper,$curEle,idx,isGroup
    })
    createRadioInside(this,{
      $curEle,$container,dataObj,idx
    })
  }
}

export default CreateValidateRadio
