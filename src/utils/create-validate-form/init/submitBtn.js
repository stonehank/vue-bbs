export function checkIsSubmit(self,$curEle){
  return $curEle.is(self.submitBtn) || $curEle.find('[data-cvf-submit]').length!==0
}


export function initSubmit(self,$curEle){
  let $rootParent=$curEle
  while($rootParent){
    let $nxtP=$rootParent.parent()
    if($nxtP.is(self.$ele))break
    $rootParent=$nxtP
  }
  self.$ele.append($curEle)
}
