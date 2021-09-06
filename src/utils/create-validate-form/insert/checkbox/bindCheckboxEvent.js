export default function bindCheckboxEvent(self,$selectorContainer,$selectorTick,dataObj){
  let {idx}=dataObj
  if(dataObj.isDisabled){
    return
  }
  $selectorContainer.on('click',() => {
    self.dirty[idx] = true
    if($selectorTick.hasClass('cvf-checkbox-selector-tick')){
      $selectorTick.removeClass('cvf-checkbox-selector-tick')
      dataObj.result=false
    }else{
      $selectorTick.addClass('cvf-checkbox-selector-tick')
      dataObj.result=true
    }
    self.validEle(dataObj)
  })
}
