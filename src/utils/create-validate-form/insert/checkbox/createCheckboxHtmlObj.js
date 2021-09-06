import $ from 'jquery'

export default function createCheckboxHtmlObj(self,{$wrapper,$curEle,idx}){
  let label = $curEle.attr('data-cvf-label')
  let isDisabled=$curEle.attr('disabled')!=null
  let $container = $('<div class="cvf-checkbox-wrapper"></div>')

  let $errorMsgEle = $('<div class="error-msg"></div>')
  let $labelEle = $('<span class="cvf-checkbox-label"></span>')
  $labelEle.text(label)

  $wrapper.append($container)
  $wrapper.append($errorMsgEle)
  // self.$ele.append($wrapper)
  let textW = $labelEle.outerWidth(true)
  let initValue=$curEle.is(':checked')
  let dataObj= {
    idx,
    key: $curEle.attr('name'),
    $curEle,
    $msgEle: $errorMsgEle,
    $labelEle,
    $legendEle:null,
    $fieldEle:null,
    label,
    textW,
    hasPlaceholder:false,
    result:initValue,
    textShow:null,
    isDisabled
  }
  self.elementData[idx] =dataObj
  return [$container,dataObj]
}
