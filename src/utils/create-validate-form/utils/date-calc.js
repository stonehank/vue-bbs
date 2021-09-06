// import {dateFormat} from './date-format'
let today=new Date()
let months=[31,0,31,30,31,30,31,31,30,31,30,31]
let todayYear=today.getFullYear()
let todayMonth=today.getMonth()
let todayDay=today.getDate()


export function monthAdd(date){
  let year=date.getFullYear()
  let month=date.getMonth()+1
  if(month===12){
    month=1
    year++
  }else{
    month++
  }
  let str=`${year}-${month}`
  return new Date(str)
}

export function monthMinus(date) {
  let year=date.getFullYear()
  let month=date.getMonth()+1
  if(month===1){
    month=12
    year--
  }else{
    month--
  }
  let str=`${year}-${month}`
  return new Date(str)

  // return new Date(date.setMonth(date.getMonth()-1))
}

export function yearAdd(date){
  let year=date.getFullYear()
  let month=date.getMonth()+1
  let newYear=year+1
  return new Date(`${newYear}-${month}`)
}

export function yearMinus(date){
  let year=date.getFullYear()
  let month=date.getMonth()+1
  let newYear=year-1
  return new Date(`${newYear}-${month}`)
}

export function decadeAdd(date){
  let year=date.getFullYear()
  let newYear=year+12
  return new Date(`${newYear}-1`)
}

export function decadeMinus(date){
  let year=date.getFullYear()
  let newYear=year-12
  return new Date(`${newYear}-1`)
}

export function checkLeapYear(year){
  if(year % 4 !==0)return false
  if(year % 100!==0)return true
  if(year % 400!==0)return false
  return true
}

export function countMonthdays(month,isLeapYear){
  if(month===1){
    return isLeapYear ? 29 : 28
  }
  return months[month]
}

export function checkIsToday(year,month,day){
  return year===todayYear && month===todayMonth && day===todayDay
}

export function calcDateBasicInfo(date){
  return [date.getFullYear(),date.getMonth(),date.getDate()]
}
