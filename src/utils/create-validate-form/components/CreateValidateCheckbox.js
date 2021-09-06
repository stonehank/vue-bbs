import CreateValidateElement from './CreateValidateElement'
import createCheckboxHtmlObj from '../insert/checkbox/createCheckboxHtmlObj'
import createCheckboxInside from '../insert/checkbox/createCheckboxInside'


class CreateValidateCheckbox extends CreateValidateElement{
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
    const [$container,dataObj]=createCheckboxHtmlObj(this,{$wrapper,$curEle,idx})
    createCheckboxInside(this,{
      $curEle,$container,dataObj,idx
    })
  }
}

export default CreateValidateCheckbox
