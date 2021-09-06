export default function selectRenderResult(result,$selectResult){
  if(Array.isArray(result)){
    $selectResult.val(result.join(','))
  }else{
    $selectResult.val(result)
  }
}
