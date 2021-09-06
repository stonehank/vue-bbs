export default function dataExist(data){
  if(data==null)return false
  if(typeof data==='string' && data.trim()==='')return false
  if(data==='""')return false
  if(data==="''")return false
  if(data==='null')return false
  return true
}
