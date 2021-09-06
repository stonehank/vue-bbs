import $ from 'jquery'

export default function createRadioHtmlObj(self,{
  $wrapper,$curEle,idx,isGroup
}){
  let vertical=false
  let initValue=null
  let radioGroupName=null
  let $container = $('<div class="cvf-radio-wrapper"></div>')
  let $errorMsgEle = $('<div class="error-msg"></div>')
  let $groupLabel=null
  let labelEleList=[]
  let labelList=[]
  let valueList=[]
  let isDisabledList=[]
  let isDisabled=null

  if(isGroup){
    let $radios=$curEle.find('input[type="radio"]')
    let radioGroupLabel=$curEle.attr('data-cvf-group-label')
    radioGroupName=$curEle.attr('data-cvf-group-name')
    isDisabled=$curEle.attr('data-cvf-disabled')!=null
    vertical=$curEle.attr('data-cvf-vertical')!=null

    if(radioGroupLabel!=null){
      $groupLabel=$(`<label class="radio-group-label">${radioGroupLabel}</label>`)
      $wrapper.append($groupLabel)
    }
    for(let i=0; i<$radios.length; i++){
      let $curInput=$radios.eq(i)
      isDisabledList[i]=$curInput.attr('disabled')!=null
      initValue=$curInput.is(':checked') ? $curInput.attr('value') : initValue
      valueList.push($curInput.attr('value'))
      radioGroupName=radioGroupName==null ? $curInput.attr('name') : radioGroupName
      let [$labelEle,label]=renderRadioInput($curInput)
      labelEleList.push($labelEle)
      labelList.push(label)
    }
  }else{
    initValue=$curEle.is(':checked') ? $curEle.attr('value') : initValue
    isDisabled=$curEle.attr('disabled')!=null
    isDisabledList=[$curEle.attr('disabled')!=null]
    valueList.push($curEle.attr('value'))
    radioGroupName=$curEle.attr('name')
    let [$labelEle,label]=renderRadioInput($curEle)
    labelEleList.push($labelEle)
    labelList.push(label)
  }
  if(vertical)$container.addClass('radio-vertical')
  $wrapper.append($container)
  $wrapper.append($errorMsgEle)

  let dataObj= {
    idx,
    key: radioGroupName,
    $curEle,
    $msgEle: $errorMsgEle,
    $labelEle:labelEleList,
    $legendEle:null,
    $fieldEle:null,
    label:labelList,
    textW:null,
    hasPlaceholder:false,
    result:initValue,
    textShow:null,
    valueList,
    $groupLabel,
    isDisabledList,
    isDisabled
  }
  self.elementData[idx] =dataObj
  return [$container,dataObj]
}


function renderRadioInput($input){
  let label = $input.attr('data-cvf-label')
  let $labelEle = $('<span class="cvf-radio-label"></span>')
  $labelEle.text(label)
  return [$labelEle,label]
}
