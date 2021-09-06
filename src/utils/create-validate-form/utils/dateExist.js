import dataExist from './dataExist'

export default function dateExist(date){
  if(!dataExist(date))return false
  if(typeof date==='object' && date.toDateString()==='Invalid Date')return false
  return true
}
