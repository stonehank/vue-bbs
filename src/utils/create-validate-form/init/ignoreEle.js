export function checkIsIgnore(self,$curEle){
  return $curEle.attr('data-cvf-ignore') != null
}


export function initIgnore(self,$curEle){
  self.$ele.append($curEle)
}
