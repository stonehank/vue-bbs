export default function bindRadioEvent(self,$selectorContainer,dataObj){
  let {idx,isDisabledList,isDisabled}=dataObj
  if(isDisabled){
    return
  }
  $selectorContainer.on('click',function(){
    let index=$selectorContainer.index(this)
    if(isDisabledList && isDisabledList[index])return
    self.dirty[idx] = true
    let $curSelectorTick=$(this).find('.radio-ticker')
    let $allSelectorTick=$selectorContainer.find('.radio-ticker')
    if(!$curSelectorTick.hasClass('cvf-radio-selector-tick')){
      $allSelectorTick.removeClass('cvf-radio-selector-tick')
      $curSelectorTick.addClass('cvf-radio-selector-tick')
      dataObj.result=dataObj.valueList[index]
    }
    self.validEle(dataObj)
  })
}
