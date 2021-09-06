import $ from 'jquery'

export default function createTextFieldHtmlObj(self,{
  $wrapper,$curEle,idx,otpOptions
}){
  let label = $curEle.attr('data-cvf-label')
  let forceMaterial=$curEle.attr('data-cvf-material')
  let isDisabled=$curEle.attr('disabled')!=null
  let style=self.material
  if(forceMaterial==='true')style=true
  else if(forceMaterial==='false')style=false
  let $container = $('<div class="cvf-fieldset-container"></div>')
  let $errorMsgEle = $('<div class="error-msg"></div>')
  let $fieldEle = $('<fieldset class="cvf-fieldset-valid-form"></fieldset>')
  let $legendEle = $('<legend class="cvf-fieldset-legend"></legend>')
  let $labelEle = $('<span class="cvf-label-text"></span>')
  let hasPlaceholder = !!$curEle.attr('placeholder')

  if(isDisabled)$container.addClass('cvf-disabled')
  if (style) $fieldEle.addClass('cvf-material-ui')
  else $fieldEle.addClass('cvf-bootstrap-ui')
  if (!label) label = ''
  else $labelEle.css({padding: '0 6px'})
  $labelEle.text(label)
  $fieldEle.append($legendEle)
  $fieldEle.append($labelEle)
  $container.append($fieldEle)
  $wrapper.append($container)
  if(otpOptions){
    /*
      otp1:{
        otpCount:4,
        sendAPI:'',
        verifyAPI:''
      }
    */
    let $otpWrapper=$('<div class="cvf-otp-wrapper"></div>')

    for(let i=0; i<otpOptions.otpCount; i++){
      let $otpInput=$('<input type=text class="cvf-otp-input" />')
      $otpWrapper.append($otpInput)
    }
    $wrapper.append($otpWrapper)
  }
  $wrapper.append($errorMsgEle)
  let textW = $labelEle.outerWidth(true)
  $legendEle.css({width: textW})
  let initValue=$curEle.val() || null
  let dataObj= {
    idx,
    key: $curEle.attr('name'),
    $curEle,
    $msgEle: $errorMsgEle,
    $labelEle,
    $legendEle,
    $fieldEle,
    label,
    textW,
    hasPlaceholder,
    result:initValue,
    textShow:null,
    isDisabled
  }
  self.elementData[idx] =dataObj
  return [$container,dataObj]
}
