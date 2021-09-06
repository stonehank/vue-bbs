import $ from 'jquery'
import bindCheckboxEvent from './bindCheckboxEvent'

export default function createCheckboxInside(self,{
  $curEle,$container,dataObj,idx
}={}){
  $curEle.addClass('cvf-valid-field')
  let {$labelEle,isDisabled}=dataObj
  let $selectorContainer = $('<div class="cvf-checkbox-selector-container"></div>')
  let $selectorBox=$('<div class="cvf-checkbox-selector-box"></div>')
  let $selectorTick=$(
    `<div>
        <span class="valid" >
          <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <path  class="mark_path" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"></path>
          </svg>
        </span>
      </div>`
  )
  $selectorBox.append($selectorTick)
  $selectorContainer.append($selectorBox)
  $selectorContainer.append($labelEle)
  $container.append($selectorContainer)

  dataObj.reset=() => {
    $selectorTick.removeClass('cvf-checkbox-selector-tick')
    dataObj.result=false
    dataObj.dirty=false
  }

  if(isDisabled){
    $selectorBox.addClass('cvf-disabled')
    return
  }
  bindCheckboxEvent(self,$selectorContainer,$selectorTick,dataObj,idx)
  if(dataObj.result){
    $selectorContainer.click()
  }
}
