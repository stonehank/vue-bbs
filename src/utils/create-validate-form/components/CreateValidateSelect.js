
import createTextFieldHtmlObj from '../insert/createTextFieldHtmlObj'
import CreateValidateElement from './CreateValidateElement'
import createSelectInside from '../insert/select/createSelectInside'


class CreateValidateSelect extends CreateValidateElement{
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
    createSelectInside(this,{
      $curEle,$container,dataObj,idx
    })
  }
}

export default CreateValidateSelect
