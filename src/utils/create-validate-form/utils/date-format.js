import dateExist from './dateExist'
const format = require('dateformat')

export function dateFormat(date, mask = 'ddd, mmm d, yyyy') {
  if (!dateExist(date)) return null
  try {
    return format(date, mask)
  } catch (_) {
    return null
  }
}

export function beforeDate(date) {
  let time = new Date(date).getTime()
  return (val) => new Date(val).getTime() <= time
}

export function afterDate(date) {
  let time = new Date(date).getTime()
  return (val) => new Date(val).getTime() >= time
}

export function betweenDate(date1, date2) {
  let time1 = new Date(date1).getTime()
  let time2 = new Date(date2).getTime()
  return (val) => {
    let time = new Date(val).getTime()
    return time <= time2 && time >= time1
  }
}

export function timeAgo(oldDate, langTxt) {
  if (!langTxt) {
    langTxt = {
      seconds: 'seconds ago',
      minutes: 'minutes ago',
      hours: 'hours ago',
      now: 'now',
      days: 'days ago',
      months: 'months ago',
    }
  }
  if (typeof oldDate !== 'object') {
    oldDate = new Date(oldDate)
  }
  let oldTime = oldDate.getTime()
  try {
    let curTime = new Date().getTime()
    let diffValue = curTime - oldTime
    let days = Math.floor(diffValue / (24 * 3600 * 1000))
    if (days === 0) {
      // 计算相差小时数
      let leave1 = diffValue % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
      let hours = Math.floor(leave1 / (3600 * 1000))
      if (hours === 0) {
        // 计算相差分钟数
        let leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
        let minutes = Math.floor(leave2 / (60 * 1000))
        if (minutes === 0) {
          // 计算相差秒数
          let leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
          let seconds = Math.round(leave3 / 1000)
          return `${seconds} ${langTxt.seconds}`
        }
        return `${minutes} ${langTxt.minutes}`
      }
      return `${hours} ${langTxt.hours}`
    }
    if (days < 0) return langTxt.now
    if (days < 30) return `${days} ${langTxt.days}`
    if (days < 365) return `${Math.floor(days / 30)} ${langTxt.months}`
    return dateFormat(oldDate, 'yyyy-mm-dd')
  } catch (error) {
    // console.error('Something wrong with timeago function.', error)
  }
  return 'Unknown'
}
