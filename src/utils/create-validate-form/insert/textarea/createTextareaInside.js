import AutoHeight from './AutoHeight'

export default function createTextareaInside(self,{
  $curEle,$container,dataObj,idx
}={}){
  $curEle[0].className='cvf-valid-field'
  if(dataObj.result)self.dirty[idx]=true
  let rows=$curEle.attr('rows') || 2
  let autoHeight=new AutoHeight({
    textarea:$curEle[0],
    rows
  })
  $container.append($curEle)

  let {showClearBtn,hideClearBtn}=self.addClearBtn($container,$curEle,dataObj)

  dataObj.reset=() => {
    $curEle.val('')
    dataObj.result=null
    dataObj.dirty=null
    autoHeight.calcHeight()
    hideClearBtn()
  }

  self.bindValidateEvent($curEle,dataObj,idx,showClearBtn,hideClearBtn)
}
