import $ from 'jquery'
import bindRadioEvent from './bindRadioEvent'


export default function createRadioInside(self,{
  $curEle,$container,dataObj,idx
}={}){
  let {$labelEle,isDisabledList,isDisabled}=dataObj
  let tickerList=[]
  for(let i=0; i<$labelEle.length; i++){
    let $selectorContainer = $('<div class="cvf-radio-selector-container"></div>')
    let $selectorBox=$('<div class="cvf-radio-selector-box"></div>')
    let $selectorTick=$('<div class="radio-ticker"></div>')
    if(isDisabledList[i] || isDisabled){
      $selectorBox.addClass('cvf-disabled')
    }
    tickerList.push($selectorTick)
    $selectorBox.append($selectorTick)
    $selectorContainer.append($selectorBox)
    $selectorContainer.append($labelEle[i])
    $container.append($selectorContainer)
  }
  dataObj.reset=() => {
    for(let i=0; i<tickerList.length; i++){
      $(tickerList[i]).removeClass('cvf-radio-selector-tick')
    }
    dataObj.result=null
    dataObj.dirty=false
  }
  bindRadioEvent(self,$container.find('.cvf-radio-selector-container'),dataObj)
}
