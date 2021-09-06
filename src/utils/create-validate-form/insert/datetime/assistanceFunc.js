import $ from 'jquery'
import {checkIsToday} from '../../utils/date-calc'

export function fillDayFirstRow(self,{
  weekday,lastMonthDay,year,month,curBeginDay
}){
  let $firstRow=$('<tr></tr>')
  for(let i=0; i<weekday; i++){
    let $cell=$(`<td class="cvf-date-body-day-cell prev-month-cell">${lastMonthDay-weekday+i+1}</td>`)
    let prevYear=year
    let prevMonth=month-1
    if(prevMonth===-1) {
      prevMonth = 11
      prevYear--
    }
    $cell.attr('data-day',`${prevYear}/${prevMonth+1}/${lastMonthDay-weekday+i+1}`)
    if(self.isAllow(`${prevYear}/${prevMonth+1}/${lastMonthDay-weekday+i+1}`)){
      self.bindDayCellEvent($cell,self)
    }else{
      $cell.addClass('cell-disabled')
    }


    $firstRow.append($cell)
  }
  for(let i=weekday; i<7; i++){
    let $cell=$(`<td class="cvf-date-body-day-cell" data-day="${year}-${month+1}-${curBeginDay}">${curBeginDay}</td>`)
    if(self.checkIsSelected(year,month,curBeginDay)){
      $cell.addClass('day-choose')
    }
    if(checkIsToday(year,month,curBeginDay)) {
      $cell.addClass('cvf-today')
    }
    if(self.isAllow(`${year}-${month+1}-${curBeginDay}`)){
      self.bindDayCellEvent($cell,self)
    }else{
      $cell.addClass('cell-disabled')
    }
    curBeginDay++
    $firstRow.append($cell)
  }
  self.$dayBodyPanel.append($firstRow)
  return curBeginDay
}

export function fillDayRestRow(self,{
  monthDay,year,month,curBeginDay
}){
  let isNextMonthCell=false
  let nxtMonthClass='next-month-cell'
  for(let i=1; i<6; i++){
    if(i===5 && isNextMonthCell)break
    let $row=$('<tr></tr>')
    for(let j=0; j<7; j++){
      if(curBeginDay>monthDay){
        isNextMonthCell=true
        curBeginDay=1
      }
      let $cell=$(`<td class="cvf-date-body-day-cell" data-day="${year}-${month+1}-${curBeginDay}">${curBeginDay}</td>`)

      if(checkIsToday(year,month,curBeginDay)) $cell.addClass('cvf-today')
      if(isNextMonthCell){
        let nxtYear=year
        let nxtMonth=month+1
        if(nxtMonth===12){
          nxtMonth=0
          nxtYear++
        }
        $cell.addClass(nxtMonthClass)
        $cell.attr('data-day',`${nxtYear}/${nxtMonth+1}/${curBeginDay}`)
        if(self.isAllow(`${nxtYear}-${nxtMonth+1}-${curBeginDay}`)){
          self.bindDayCellEvent($cell,self)
        }else{
          $cell.addClass('cell-disabled')
        }
        if(self.checkIsSelected(nxtYear,nxtMonth,curBeginDay))$cell.addClass('day-choose')
      }else{
        if(self.checkIsSelected(year,month,curBeginDay)){
          $cell.addClass('day-choose')
        }
        if(self.isAllow(`${year}-${month+1}-${curBeginDay}`)){
          self.bindDayCellEvent($cell,self)
        }else{
          $cell.addClass('cell-disabled')
        }
      }
      curBeginDay++
      $row.append($cell)
    }
    self.$dayBodyPanel.append($row)
  }
}
