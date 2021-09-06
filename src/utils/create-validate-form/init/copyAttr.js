export default function copyAttr($oldEle,$newEle,exclude,only=null){
  let attr=$oldEle.attr()
  if(attr==null)return $newEle
  for(let key in attr){
    if(attr.hasOwnProperty(key)){
      if(only && !only.includes(key))continue
      if(exclude && exclude.includes(key))continue
      if(key==='disabled'){
        $newEle.addClass('cvf-disabled')
      }else if(key==='class'){
        $newEle.addClass(attr[key])
      }else {
        $newEle.attr(key,attr[key])
      }
    }
  }
  return $newEle
}
