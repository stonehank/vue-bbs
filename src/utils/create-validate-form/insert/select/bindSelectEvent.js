import $ from 'jquery'
import selectHideDropdown from './event/selectHideDropdown'
import selectShowDropdown from './event/selectShowDropdown'
import selectChoose from './event/selectChoose'

export default function bindSelectEvent(self,{
  value,name,optEles,active,dataObj,$selectQuery,$queryPanel,$selectResult,$selectOptCont,isMulti,idx,showClearBtn,hideClearBtn
}){
  let query=''
  let curValue=value.slice()
  let curName=name.slice()
  let curOptEles=optEles.slice()
  let curActive=active.slice()

  dataObj.reset=() => {
    $selectResult.val('')
    curOptEles.forEach((optE) => $(optE).removeClass('cvf-select-active'))
    dataObj.result=null
    dataObj.textShow=null
    dataObj.dirty=false
    hideClearBtn()
  }
  dataObj.reset()

  setTimeout(() => {
    self._elementBlur(idx)
  },0)
  if(dataObj.isDisabled){
    return
  }
  $selectOptCont.on('pointerdown',false)
  $selectOptCont.on('click',(ev) => {
    let $curItem=$(ev.target)
    if(!$curItem.hasClass('cvf-select-option-item'))return
    if($curItem.hasClass('cvf-disabled'))return
    let index=$curItem.index()
    ev.stopPropagation()
    if(isMulti){
      if(dataObj.result==null)dataObj.result=[]
      if(dataObj.textShow==null)dataObj.textShow=[]
      let existIdx=dataObj.result.indexOf((curValue[index]))
      if(existIdx===-1){
        dataObj.result.push(curValue[index])
        dataObj.textShow.push(curName[index])
        $curItem.addClass('cvf-select-active')
      }else{
        dataObj.result.splice(existIdx,1)
        dataObj.textShow.splice(existIdx,1)
        $curItem.removeClass('cvf-select-active')
      }
      if(dataObj.result.length===0 && dataObj.textShow.length===0){
        hideClearBtn()
      }else{
        showClearBtn()
      }
    }else{
      dataObj.result=curValue[index]
      dataObj.textShow=curName[index]
      curOptEles.forEach(($ele) => $ele.removeClass('cvf-select-active'))
      $curItem.addClass('cvf-select-active')
      showClearBtn()
    }
    selectChoose(self,{
      idx,$selectResult,$selectOptCont,isMulti
    })
  })

  $selectQuery.on('focus',(ev) => {
    ev.stopPropagation()
    self.dirty[idx]=true
    // console.log(dataObj.result,curValue)
    selectShowDropdown(self,{idx,$selectOptCont,$selectResult})
  })


  $selectQuery.on('blur',() => {
    $selectResult.val(dataObj.textShow)
    softReset()
    render()
    selectHideDropdown(self,idx)
  })
  $selectQuery.on('input',function() {
    query=$(this).val()
    curValue=[]
    curName=[]
    curOptEles=[]
    curActive=[]
    if(query===''){
      hideQueryPanel()
      softReset()
    }else{
      showQueryPanel(query)
      for(let i=0; i<value.length; i++){
        if(hasQuery(name[i],query) && active[i]){
          curValue.push(value[i])
          curName.push(name[i])
          curActive.push(active[i])
        }
      }
    }
    render()
  })

  function hasQuery(template,q){
    return template.toLowerCase().includes(q.toLowerCase())
  }

  function hideQueryPanel(){
    $queryPanel.text('')
    $queryPanel.removeClass('query-panel-show')
  }

  function showQueryPanel(){
    $queryPanel.text(query)
    $queryPanel.addClass('query-panel-show')
  }

  function softReset(){
    curValue=value.slice()
    curName=name.slice()
    curOptEles=optEles.slice()
    curActive=active.slice()
    $selectQuery.val('')
    query=''
    hideQueryPanel()
  }

  function render(){
    $selectOptCont.html('')
    if(curValue.length===0){
      $selectOptCont.append($('<div class="cvf-select-option-item cvf-disabled">No Result</div>'))
      return
    }
    for(let i=0; i<curValue.length; i++){
      let disabledCls='cvf-disabled'
      let $selectOptItem=$(`<div class="cvf-select-option-item">${curName[i]}</div>`)
      if(!curActive[i]){
        $selectOptItem.addClass(disabledCls)
      }
      if(isMulti){
        if(dataObj.result && dataObj.result.indexOf(curValue[i])!==-1){
          $selectOptItem.addClass('cvf-select-active')
        }else{
          $selectOptItem.removeClass('cvf-select-active')
        }
      }else if(dataObj.result===curValue[i]){
        $selectOptItem.addClass('cvf-select-active') 
      }else{
        $selectOptItem.removeClass('cvf-select-active')
      }
      curOptEles.push($selectOptItem)
      $selectOptCont.append($selectOptItem)
    }
  }
}
