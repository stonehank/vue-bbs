import $ from 'jquery'
import bindSelectEvent from './bindSelectEvent'
import copyAttr from '../../init/copyAttr'

export default function createSelectInside(self,{
  $curEle,$container,dataObj,idx
}={}){
  let $options=$curEle.children()
  let value=[]
  let name=[]
  let optEles=[]
  let active=[]

  let isMulti=$curEle.attr('data-cvf-multiple')!=null
  let $selectResult=$('<input class="cvf-select-result cvf-valid-field" readonly/>')
  let $selectQuery=$('<input class="cvf-select-query" />')
  let $queryPanel=$('<span class="cvf-select-query-panel"></span>')
  let $selectWrapper=$('<div class="cvf-select-wrapper"></div>')
  let $selectOptCont=$(`<div class="cvf-select-option-container" style="width:${$container.width()}px"></div>`)
  $selectWrapper=copyAttr($curEle,$selectWrapper,['data-cvf-label','data-cvf-multiple','class'])

  for(let i=0; i<$options.length; i++){
    let $selectOptItem=$('<div class="cvf-select-option-item"></div>')
    optEles.push(copyAttr($options.eq(i),$selectOptItem,['value']))
    value.push($options.eq(i).attr('value'))
    name.push($options.eq(i).text())
    active.push($options.eq(i).attr('disabled')==null)
    $selectOptCont.append($selectOptItem)
  }
  $selectWrapper.append($selectResult)
  $selectWrapper.append($selectQuery)
  $selectWrapper.append($queryPanel)
  $('body').append($selectOptCont)

  for(let i=0; i<value.length; i++){
    optEles[i].text(name[i])
  }


  $container.append($selectWrapper)

  let {showClearBtn,hideClearBtn}=self.addClearBtn($selectWrapper,$selectResult,dataObj)
  bindSelectEvent(self,{
    value,name,optEles,active,dataObj,$queryPanel,$selectQuery,$selectResult,$selectOptCont,isMulti,idx,showClearBtn,hideClearBtn
  })
}
