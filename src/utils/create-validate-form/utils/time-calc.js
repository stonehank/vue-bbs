export function toDouble(num){
  if(num<10)return `0${+num}`
  return `${num}`
}

export function changeHour(date,hour){
  if(!date)return null
  let newDate=new Date(date)
  newDate.setHours(hour)
  return newDate
}

export function changeMinute(date,minute){
  if(!date)return null
  let newDate=new Date(date)
  newDate.setMinutes(minute)
  return newDate
}
