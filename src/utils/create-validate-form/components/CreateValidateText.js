import '../mask-options'
import 'jquery-mask-plugin'
import createTextFieldHtmlObj from '../insert/createTextFieldHtmlObj'
import createInputInside from '../insert/input/createInputInside'
import CreateValidateElement from './CreateValidateElement'


class CreateValidateText extends CreateValidateElement{
  constructor({
    ele = null,
    rules = [],
    material = true,
    showSuccess = true,
    otpOptions={},
  } = {}) {
    super({
      ele,
      rules,
      material,
      showSuccess,
    })
    this.otpOptions=otpOptions
    this.init()
  }

  insertElement($wrapper,$curEle,idx){
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
}

export default CreateValidateText
