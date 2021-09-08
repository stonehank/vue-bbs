
class ValidateClass {
  constructor({
    eleLength= null,
    showSuccess = true,
    rules = [],
  } = {}) {
    if (eleLength == null) throw new Error('Need ele length')
    this.len = eleLength
    this.rules = rules
    this.showSuccess=showSuccess
    this.isValidates = Array(this.len).fill(null)
    this.dirty = []
    this.errorMsg = []
    this.allValid = false
  }


  validAll(dataObjArr) {
    this.allValid = true
    for (let i = 0; i < dataObjArr.length; i++) {
      if(this.validEle(dataObjArr[i])===false){
        this.allValid=false
      }
    }
    return this.allValid
  }

  validEle(dataObj) {
    if (!dataObj) return null
    let eleValue=dataObj.$curEle.val()
    if(eleValue !== dataObj.result){
      dataObj.result=eleValue
      dataObj.textShow=eleValue
    }
    let {idx:index}=dataObj
    if(!this.dirty[index]){
      this.isValidates[index] = null
      this.validate_render(dataObj,index)
      return null
    }
    let curRules = this.rules[index]
    let valid = null
    if (Array.isArray(curRules)) {
      for (let i = 0; i < curRules.length; i++) {
        let curRule = curRules[i]
        if (typeof curRule === 'string') {
          throw TypeError('rules must be array')
        } else if (typeof curRule !== 'function') {
          curRule = null
        }
        if (curRule) {
          let msg = curRule(eleValue)
          if (msg !== true) {
            this.isValidates[index] = false
            this.errorMsg[index] = msg
            valid = false
          } else {
            valid = true
          }
        }
        if (!valid) break
      }
    }
    this.isValidates[index] = valid
    this.validate_render(dataObj,index)
    return valid
  }

  validate_render(dataObj,index) {
    let {
      $msgEle, $fieldEle, $labelEle,$groupLabel,isDisabled
    } = dataObj
    // $labelEle=$($labelEle)
    // $fieldEle=$($fieldEle)
    let errorMsg = this.errorMsg[index]
    let isValid = this.isValidates[index]
    if (isValid === true && !isDisabled) {
      if($fieldEle){
        removeClassFromEles($fieldEle,'cvf-error')
        if(this.showSuccess){
          addClassFromEles($fieldEle,'cvf-success')
        }
      }
      removeClassFromEles($labelEle,'cvf-text-error')
      removeClassFromEles($groupLabel,'cvf-text-error')
      if(this.showSuccess){
        addClassFromEles($labelEle,'cvf-text-success')
        addClassFromEles($groupLabel,'cvf-text-success')
      }
      $msgEle.text(null)
    } else if (isValid === false && !isDisabled) {
      if($fieldEle){
        removeClassFromEles($fieldEle,'cvf-success')
        addClassFromEles($fieldEle,'cvf-error')
      }
      removeClassFromEles($labelEle,'cvf-text-success')
      removeClassFromEles($groupLabel,'cvf-text-success')
      addClassFromEles($labelEle,'cvf-text-error')
      addClassFromEles($groupLabel,'cvf-text-error')
      $msgEle.text(errorMsg)
    }else{
      if($fieldEle){
        removeClassFromEles($fieldEle,'cvf-success')
        removeClassFromEles($fieldEle,'cvf-error')
      }
      removeClassFromEles($labelEle,'cvf-text-success')
      removeClassFromEles($groupLabel,'cvf-text-success')
      removeClassFromEles($labelEle,'cvf-text-error')
      removeClassFromEles($groupLabel,'cvf-text-error')
      $msgEle.text('')
    }
  }
}

function removeClassFromEles($ele,clsName){
  if($ele==null)return
  $ele=$($ele)
  $ele.each((idx,ele) => {
    $(ele).removeClass(clsName)
  })
}

function addClassFromEles($ele,clsName){
  if($ele==null)return
  $ele=$($ele)
  $ele.each((idx,ele) => {
    $(ele).addClass(clsName)
  })
}

export default ValidateClass
