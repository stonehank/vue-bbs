import $ from 'jquery'

export default function createInputInside(self,{
  $curEle,$container,dataObj,idx
}={}){
  $curEle[0].className='cvf-valid-field'
  $container.append($curEle)
  if(dataObj.result)self.dirty[idx]=true
  dataObj.reset=() => {
    $curEle.val('')
    dataObj.result=null
  }
  let {showClearBtn,hideClearBtn}=self.addClearBtn($container,$curEle,dataObj)
  if($curEle.attr('data-cvf-eyeicon')!=null){
    let $eyeIcon=$('<span class="far fa-eye-slash cvf-eye-icon"></span>')
    $container.append($eyeIcon)
    $eyeIcon.on('click',() => {
      if($eyeIcon.hasClass('fa-eye')){
        $curEle.attr('type','password')
      }else{
        $curEle.attr('type','text')
      }
      $eyeIcon.toggleClass('fa-eye')
      $eyeIcon.toggleClass('fa-eye-slash')
    })
  }
  self.bindValidateEvent($curEle,dataObj,idx,showClearBtn,hideClearBtn)
}
