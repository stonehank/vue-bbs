
import createTextFieldHtmlObj from '../insert/createTextFieldHtmlObj'
import CreateValidateElement from './CreateValidateElement'
import createTextareaInside from '../insert/textarea/createTextareaInside'


class CreateValidateTextarea extends CreateValidateElement{
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
    const [$container,dataObj]=createTextFieldHtmlObj(this,{$wrapper,$curEle,idx})
    createTextareaInside(this,{
      $curEle,$container,dataObj,idx
    })
  }
}

export default CreateValidateTextarea
