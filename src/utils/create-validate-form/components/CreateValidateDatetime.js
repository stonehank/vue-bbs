import 'pepjs'

import createTextFieldHtmlObj from '../insert/createTextFieldHtmlObj'
import CreateValidateElement from './CreateValidateElement'
import createDateTimeInside from '../insert/datetime/createDateTimeInside'


class CreateValidateDatetime extends CreateValidateElement{
  constructor({
    ele = null,
    rules = [],
    material = true,
    showSuccess = true,
    type='datetime'
  } = {}) {
    super({
      ele,
      rules,
      material,
      showSuccess,
    })
    this.type=type
    this.init()
  }
  
  insertElement($wrapper,$curEle,idx){
    let type=$curEle.attr('type')
    let realType=type
    if(type==='datetime-local' || type==='datetime')realType='datetime'
    else if(type!=='time' && type!=='date')realType=this.type
    const [$container,dataObj]=createTextFieldHtmlObj(this,{$wrapper,$curEle,idx})
    createDateTimeInside(this,{
      $curEle,
      $container,
      dataObj,
      idx,
      type:realType,
    })
  }
}

export default CreateValidateDatetime
