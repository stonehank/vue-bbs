
import createTextFieldHtmlObj from '../insert/createTextFieldHtmlObj'
import CreateValidateElement from './CreateValidateElement'
import createPasswordInputInside from '../insert/input/createPasswordInputInside'


class CreateValidatePassword extends CreateValidateElement{
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
    createPasswordInputInside(this,{
      $curEle,$container,dataObj,idx
    })
  }
}

export default CreateValidatePassword
