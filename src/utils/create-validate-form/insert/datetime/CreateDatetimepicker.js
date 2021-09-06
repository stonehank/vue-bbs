import $ from 'jquery'
import {dateFormat} from '../../utils/date-format'
import {
  calcDateBasicInfo, checkLeapYear, countMonthdays, decadeAdd, decadeMinus, monthAdd, monthMinus, yearAdd, yearMinus
} from '../../utils/date-calc'
import {changeHour, changeMinute, toDouble} from '../../utils/time-calc'
import CreateTimeSelect from './CreateTimeSelect'
import {fillDayFirstRow,fillDayRestRow} from './assistanceFunc'

export default class Datetimepicker{
  constructor({
    $container=null,
    $curEle=null,
    allowedDate={from:null,to:null},
    minView='time',
    datePanel=true,
    timePanel=true,
    initView='month',
    initDate=new Date(),
    initHour='00',
    initMinute='00',
    format='yyyy-mm-dd, ddd, HH:MM',
    selectedDate=() => {},
    selectedTime=() => {},
    opened=() => {},
    closed=() => {},
  }={}){
    let self=this
    this.$curEle=$curEle
    this.$container=$container
    this.datePanel=datePanel
    this.timePanel=timePanel
    this.initDate=new Date(initDate)
    this.minView=minView
    this.selectedDate=selectedDate
    this.selectedTime=selectedTime

    this.opened=opened
    this.closed=closed
    this.format=format

    this.allowFromTime=null
    this.allowToTime=null
    this.initView=initView
    this.curView=initView
    this.chooseDate=null
    this.$chooseDayEle=null
    this.chooseHour=toDouble(initHour)
    this.chooseMinute=toDouble(initMinute)
    // console.log(initHour,initMinute)
    this.resolveDisable(allowedDate)
    let curYear=new Date().getFullYear()
    this.maxYear=curYear+100
    this.minYear=curYear-100
    this.hasBindDay=false
    this.createContainer()

    this.$curEle.on('focus',(ev) => {
      ev.stopPropagation()
      ev.preventDefault()
      this.opened()
      this.showWrapper()
    })


    this.$curEle.on('blur',() => {
      self.hideWrapper()
      self.closed()
    })


    this.handleDayPrev=this.handleDayPrev.bind(this)
    this.handleDayNext=this.handleDayNext.bind(this)
    this.handleDayInfo=this.handleDayInfo.bind(this)
    this.handleMonthPrev=this.handleMonthPrev.bind(this)
    this.handleMonthNext=this.handleMonthNext.bind(this)
    this.handleMonthInfo=this.handleMonthInfo.bind(this)
    this.handleYearPrev=this.handleYearPrev.bind(this)
    this.handleYearNext=this.handleYearNext.bind(this)
    this.timeMinuteChange=this.timeMinuteChange.bind(this)
    this.timeHourChange=this.timeHourChange.bind(this)
  }

  resolveDisable(allowedDate){
    let {from ,to}=allowedDate
    if(from==null)from=-Infinity
    else from=new Date(from).getTime()
    if(to==null)to=Infinity
    else to=new Date(to).getTime()
    this.allowFromTime=from
    this.allowToTime=to
  }

  isAllow(maxDate,minDate){
    let maxDateTime=new Date(maxDate).getTime()
    let minDateTime=new Date(minDate || maxDate).getTime()
    if(this.allowFromTime>this.allowToTime){
      return maxDateTime>=this.allowFromTime || minDateTime<=this.allowToTime
    }
    return maxDateTime>=this.allowFromTime && minDateTime<=this.allowToTime
  }

  showWrapper(){
    this.$outerBox.css({display:'block'})
    if(this.datePanel){
      this.showDateWrapper()
    }else{
      this.showTimeWrapper()
    }
  }

  showTimeWrapper(){
    this.$timeWrapper.css({display:'block'})
  }

  showDateWrapper(){
    if(this.curView==='time')this.$timeWrapper.css({display:'block'})
    else this.$dateWrapper.css({display:'block'})
    this.initDate=this.chooseDate || this.initDate
    this.showInitPanel(this.initDate)
    this.bindDateDayEvent()
    this.bindDateMonthEvent()
    this.bindDateYearEvent()
  }

  hideWrapper(){
    this.$outerBox.css({display:'none'})
    this.$dateWrapper.css({display:'none'})
    this.$timeWrapper.css({display:'none'})
  }


  showInitPanel(date){
    this.$dayPanel.css({display:'none'})
    this.$monthPanel.css({display:'none'})
    this.$yearPanel.css({display:'none'})
    if(this.curView==='day'){
      this.$dayPanel.css({display:'table'})
      this.dayPanelRender(date)
    }else if(this.curView==='month'){
      this.$monthPanel.css({display:'table'})
      this.monthPanelRender(date)
    }else if(this.curView==='year'){
      this.$yearPanel.css({display:'table'})
      this.yearPanelRender(date)
    }
  }

  createContainer(){
    this.$outerBox=$('<div class="cvf-datetime-outerwrapper"></div>')
    this.createDatetimePanel()
    this.$container.append(this.$outerBox)
    this.$outerBox.on('pointerdown',false)
  }


  createDatetimePanel(){
    this.createDatePanel()
    this.createSwitch()
    this.createTimePanel()
    if(this.datePanel)this.$outerBox.append(this.$dateWrapper)
    if(this.datePanel && this.timePanel)this.$outerBox.append(this.$switch)
    if(this.timePanel)this.$outerBox.append(this.$timeWrapper)
  }

  switchDate2Time(){
    this.$switchHandle.removeClass('fa-clock-o')
    this.$switchHandle.addClass('fa-calendar')
    this.curView='time'
    this.$dateWrapper.css({
      display:'none'
    })
    this.$timeWrapper.css({
      display:'block'
    })
  }

  switchTime2Date(){
    this.$switchHandle.removeClass('fa-calendar')
    this.$switchHandle.addClass('fa-clock-o')
    this.curView=this.initView
    this.$dateWrapper.css({
      display:'block'
    })
    this.showInitPanel(this.chooseDate || this.initDate)
    this.$timeWrapper.css({
      display:'none'
    })
  }

  createSwitch(){
    let self=this
    this.$switch=$('<div class="cvf-datetime-switch"></div>')
    this.$switchHandle=$('<span class="fa fa-clock-o"></span>')
    this.$switch.append(this.$switchHandle)
    this.$switch.on('pointerdown',false)
    this.$switch.click(() => {
      if(this.$switchHandle.hasClass('fa-clock-o')){
        self.switchDate2Time()
      }else{
        self.switchTime2Date()
      }
    })
  }

  timeMinuteChange(minute){
    this.chooseDate=changeMinute(this.chooseDate,minute)
    this.chooseMinute=minute
    this.$minuteInfo.text(minute)
    this.minuteSelect.update(minute)
    if(this.timePanel && !this.datePanel){
      this.$curEle.val(`${toDouble(this.chooseHour)}:${toDouble(this.chooseMinute)}`)
    }else{
      let val=this.$curEle.val()
      if(val!==''){
        let outputStr=`${dateFormat(this.chooseDate,this.format)}`
        this.$curEle.val(outputStr)
      }
    }
    this.selectedTime(this.chooseHour,this.chooseMinute)
  }

  timeHourChange(hour){
    this.chooseDate=changeHour(this.chooseDate,hour)
    this.chooseHour=hour
    this.$hourInfo.text(hour)
    this.hourSelect.update(hour)
    if(this.timePanel && !this.datePanel){
      this.$curEle.val(`${toDouble(this.chooseHour)}:${toDouble(this.chooseMinute)}`)
    }else{
      let val=this.$curEle.val()
      if(val!==''){
        let outputStr=`${dateFormat(this.chooseDate,this.format)}`
        this.$curEle.val(outputStr)
      }
    }
    this.selectedTime(this.chooseHour,this.chooseMinute)
  }


  createTimePanel(){
    this.$timeWrapper=$('<div class="cvf-time-wrapper"></div>')
    this.$timePanel=$('<div class="cvf-time-container"> </div>')
    let $timeHourPanel=$(' <div class="cvf-timepanel-hour"></div>')
    let $hourPrev=$('<span class="cvf-hour-prev fa fa-caret-up"></span>')
    let $hourNext=$('<span class="cvf-hour-next fa fa-caret-down"></span>')
    let $hourInfo=$(`<span class="cvf-hour-info">${this.chooseHour}</span>`)
    $timeHourPanel.append($hourPrev)
    $timeHourPanel.append($hourInfo)
    $timeHourPanel.append($hourNext)
    let $timeColonPanel=$('<div class="cvf-timepanel-colon">:</div>')
    let $timeMinutePanel=$('<div class="cvf-timepanel-minute"></div>')
    let $minutePrev=$('<span class="cvf-minute-prev fa fa-caret-up"></span>')
    let $minuteNext=$('<span class="cvf-minute-next fa fa-caret-down"></span>')
    let $minuteInfo=$(`<span class="cvf-minute-info">${this.chooseMinute}</span>`)
    $timeMinutePanel.append($minutePrev)
    $timeMinutePanel.append($minuteInfo)
    $timeMinutePanel.append($minuteNext)
    this.$timeEnsureBtn=$('<div class="cvf-time-choose-btn">Select</div>')
    $minutePrev.on('pointerdown',false)
    $minuteNext.on('pointerdown',false)
    $hourPrev.on('pointerdown',false)
    $hourNext.on('pointerdown',false)
    this.$timeWrapper.on('pointerdown',false)

    this.$hourInfo=$hourInfo
    this.$minuteInfo=$minuteInfo


    // 创建hour list选择 ul li
    // pointerdown 滑动24px 1格
    // mousewheel 滚动1次 1格
    // keyboard 上下，按一次1格

    let $hourSelectPanel=$('<div class="cvf-select-panel cvf-hour-select-panel"></div>')

    let $minuteSelectPanel=$('<div class="cvf-select-panel cvf-minute-select-panel"></div>')

    this.hourSelect=new CreateTimeSelect({
      $ele:$hourSelectPanel,
      count:24,
      initTime:this.chooseHour,
      selected:(hour) => {
        this.timeHourChange(hour)
        $hourSelectPanel.toggle()
        $hourInfo.text(toDouble(hour))
      }
    })

    this.minuteSelect=new CreateTimeSelect({
      $ele:$minuteSelectPanel,
      count:60,
      initTime:this.chooseMinute,
      selected:(minute) => {
        this.timeMinuteChange(minute)
        $minuteSelectPanel.toggle()
        $minuteInfo.text(toDouble(minute))
      }
    })

    this.$timeEnsureBtn.on('click',() => {
      this.timeHourChange(this.chooseHour)
      this.timeMinuteChange(this.chooseMinute)
      this.$curEle.blur()
    })

    $minutePrev.click(() => {
      let minute=parseInt($minuteInfo.text(),10)
      let select=toDouble((minute-1+60) % 60)
      this.timeMinuteChange(select)
    })

    $minuteNext.click(() => {
      let minute=parseInt($minuteInfo.text(),10)
      let select=toDouble((minute+1+60) % 60)
      this.timeMinuteChange(select)
    })

    $hourPrev.click(() => {
      let hour=parseInt($hourInfo.text(),10)
      let select=toDouble((hour-1+24) % 24)
      this.timeHourChange(select)
    })

    $hourNext.click(() => {
      let hour=parseInt($hourInfo.text(),10)
      let select=toDouble((hour+1+24) % 24)
      this.timeHourChange(select)
    })

    $minuteInfo.on('click',() => {
      $minuteSelectPanel.toggle()
    })

    $hourInfo.on('click',() => {
      $hourSelectPanel.toggle()
    })

    this.$timePanel.append($timeHourPanel)
    this.$timePanel.append($timeColonPanel)
    this.$timePanel.append($timeMinutePanel)
    this.$timeWrapper.append(this.$timePanel)
    this.$timeWrapper.append(this.$timeEnsureBtn)
    this.$timeWrapper.append($hourSelectPanel)
    this.$timeWrapper.append($minuteSelectPanel)
  }

  selectTimeTrigger(timeStr){
    this.chooseTime=timeStr
    if(this.timePanel && !this.datePanel){
      this.$curEle.val(dateFormat(this.chooseDate,this.format))
      this.selectedTime(this.chooseTime)
    }else{
      let val=this.$curEle.val()
      if(val!==''){
        let outputStr=`${dateFormat(this.chooseDate,this.format)}`
        this.$curEle.val(outputStr)
      }
    }
  }


  createDatePanel(){
    this.$dateWrapper=$('<div class="cvf-date-wrapper"></div>')
    this.createDateDayPanel()
    this.createDateMonthPanel()
    this.createDateYearPanel()
    this.$dateWrapper.append(this.$dayPanel)
    this.$dateWrapper.append(this.$monthPanel)
    this.$dateWrapper.append(this.$yearPanel)

    this.$dateWrapper.on('pointerdown',false)
  }


  checkIsSelected(year,month,day){
    if(!this.chooseDate)return false
    let [chooseYear,chooseMonth,chooseDay]=calcDateBasicInfo(this.chooseDate)
    return (year===chooseYear && (month==null ? true : chooseMonth===month) && (day==null ? true : chooseDay===day))
  }

  dayPanelRender(date){
    const [year,month]=calcDateBasicInfo(date)
    let dateStr=dateFormat(date,'mmm yyyy')
    let isLearYear=checkLeapYear(year)
    let monthDay=countMonthdays(month,isLearYear)
    let lastMonthDay=countMonthdays((month+12) % 12,isLearYear)
    let curBeginDay=1
    let firstDate=new Date(`${year}-${month+1}-1`)
    let weekday=firstDate.getDay()
    this.$dayBodyPanel.text('')
    // Fill first row
    curBeginDay=fillDayFirstRow(this,{
      weekday,lastMonthDay,year,month,curBeginDay
    })
    // Fill other row
    fillDayRestRow(this,{
      monthDay,year,month,curBeginDay
    })
    this.$chooseDayEle=$('.day-choose')
    $('.cvf-date-day-info').text(dateStr)
  }

  bindDayCellEvent($cell,self){
    $cell.on('pointerdown',false)
    $cell.click(function(ev){
      ev.stopPropagation()
      ev.preventDefault()
      let curDate=$(this).attr('data-day')
      if(self.$chooseDayEle){
        self.$chooseDayEle.removeClass('day-choose')
      }
      self.chooseDate=new Date(`${curDate} ${self.chooseHour}:${self.chooseMinute}`)
      if($(this).hasClass('next-month-cell')){
        $('.cvf-date-day-next').click()
      }else if($(this).hasClass('prev-month-cell')){
        $('.cvf-date-day-prev').click()
      }else{
        $(this).addClass('day-choose')
        self.$chooseDayEle=$('.day-choose')
      }
      let outputStr=dateFormat(self.chooseDate,self.format)
      self.$curEle.val(outputStr)
      self.selectedDate(self.chooseDate)
      if(self.timePanel && self.minView==='time'){
        self.switchDate2Time()
      }else{
        // self.hideWrapper()
        self.$curEle.blur()
      }
    })
  }

  handleDayPrev(ev){
    ev.stopPropagation()
    ev.preventDefault()
    let newDate=monthMinus(this.initDate)
    this.initDate=newDate
    this.dayPanelRender(newDate)
  }

  handleDayNext(ev){
    ev.stopPropagation()
    ev.preventDefault()
    let newDate=monthAdd(this.initDate)
    this.initDate=newDate
    this.dayPanelRender(newDate)
  }

  handleDayInfo(ev){
    ev.stopPropagation()
    ev.preventDefault()
    this.curView='month'
    this.showInitPanel(this.initDate)
  }

  bindDateDayEvent(){
    if(this.hasBindDay)return
    this.hasBindDay=true
    $('.cvf-date-day-prev').on('pointerdown',false)
    $('.cvf-date-day-next').on('pointerdown',false)
    $('.cvf-date-day-info').on('pointerdown',false)
    $('.cvf-date-day-prev').on('click',this.handleDayPrev)
    $('.cvf-date-day-next').on('click',this.handleDayNext)
    $('.cvf-date-day-info').on('click',this.handleDayInfo)
  }

  handleMonthPrev(ev){
    ev.stopPropagation()
    ev.preventDefault()
    let newDate=yearMinus(this.initDate)
    this.initDate=newDate
    this.monthPanelRender(newDate)
  }

  handleMonthNext(ev){
    ev.stopPropagation()
    ev.preventDefault()
    let newDate=yearAdd(this.initDate)
    this.initDate=newDate
    this.monthPanelRender(newDate)
  }

  handleMonthInfo(ev){
    ev.stopPropagation()
    ev.preventDefault()
    this.curView='year'
    this.showInitPanel(this.initDate)
  }

  bindDateMonthEvent(){
    if(this.hasBindMonth)return
    this.hasBindMonth=true
    $('.cvf-date-month-prev').on('pointerdown',false)
    $('.cvf-date-month-next').on('pointerdown',false)
    $('.cvf-date-month-info').on('pointerdown',false)
    $('.cvf-date-month-prev').on('click',this.handleMonthPrev)
    $('.cvf-date-month-next').on('click',this.handleMonthNext)
    $('.cvf-date-month-info').on('click',this.handleMonthInfo)
  }

  bindMonthCellEvent($cell,self){
    $cell.on('pointerdown',false)
    $cell.click(function(ev){
      ev.stopPropagation()
      ev.preventDefault()
      let newDate=new Date($(this).attr('data-month'))
      self.curView='day'
      self.showInitPanel(newDate)
      self.initDate=newDate
    })
  }

  monthPanelRender(date){
    const [year]=calcDateBasicInfo(date)
    this.$monthBodyPanel.text('')
    let $row=$('<tr></tr>')
    let $td=$('<td colspan="7"></td>')
    for(let i=0; i<3; i++){
      for(let j=0; j<4; j++){
        let curMonth=i*4+j+1
        let $cell=$(`<span class="cvf-date-body-month-cell" data-month="${year}-${curMonth}">${curMonth}</span>`)
        if(this.checkIsSelected(year,curMonth-1))$cell.addClass('day-choose')
        let isLearYear=checkLeapYear(year)
        let monthDay=countMonthdays(curMonth-1,isLearYear)
        // console.log(curMonth,isLearYear,this.isAllow(`${year}-${curMonth}-${monthDay}`))
        let checkDateMin=`${year}-${curMonth}-1`
        let checkDateMax=`${year}-${curMonth}-${monthDay}`
        if(this.isAllow(checkDateMax,checkDateMin)){
          this.bindYearCellEvent($cell,this)
        }else{
          $cell.addClass('cell-disabled')
        }
        this.bindMonthCellEvent($cell,this)
        $td.append($cell)
      }
    }
    $row.append($td)
    $('.cvf-date-month-info').text(year)
    this.$monthBodyPanel.append($row)
  }

  bindYearCellEvent($cell,self){
    $cell.on('pointerdown',false)
    $cell.click(function(ev){
      ev.stopPropagation()
      ev.preventDefault()
      let newDate=new Date($(this).attr('data-year'))
      self.curView='month'
      self.showInitPanel(newDate)
      self.initDate=newDate
    })
  }

  handleYearPrev(ev){
    ev.stopPropagation()
    ev.preventDefault()
    let newDate=decadeMinus(this.initDate)
    this.initDate=newDate
    this.yearPanelRender(newDate)
  }

  handleYearNext(ev){
    ev.stopPropagation()
    ev.preventDefault()
    let newDate=decadeAdd(this.initDate)
    this.initDate=newDate
    this.yearPanelRender(newDate)
  }

  bindDateYearEvent(){
    if(this.hasBindYear)return
    this.hasBindYear=true
    $('.cvf-date-year-prev').on('pointerdown',false)
    $('.cvf-date-year-next').on('pointerdown',false)
    $('.cvf-date-year-prev').on('click',this.handleYearPrev)
    $('.cvf-date-year-next').on('click',this.handleYearNext)
    // $('.cvf-date-year-info').on('click',this.handleYearInfo)
  }

  yearPanelRender(date){
    const [year]=calcDateBasicInfo(date)
    this.$yearBodyPanel.text('')
    let $row=$('<tr></tr>')
    let $td=$('<td colspan="7"></td>')
    for(let i=0; i<3; i++){
      for(let j=0; j<4; j++){
        let curYear=year-5+(i*4+j)
        let $cell=$(`<span class="cvf-date-body-year-cell" data-year="${curYear}-1">${curYear}</span>`)
        if(this.checkIsSelected(curYear))$cell.addClass('day-choose')
        let checkDateMin=`${curYear}-1-1`
        let checkDateMax=`${curYear}-12-31`
        if(this.isAllow(checkDateMax,checkDateMin)){
          this.bindYearCellEvent($cell,this)
        }else{
          $cell.addClass('cell-disabled')
        }
        $td.append($cell)
      }
    }
    $row.append($td)
    $('.cvf-date-year-info').text(`${year-5}-${year+6}`)
    this.$yearBodyPanel.append($row)
  }

  createDateDayPanel(){
    this.$dayPanel=$(`
      <table>
        <thead>
          <tr class="cvf-date-day-head-action">
              <th class="cvf-date-day-prev prev-arrow">
                <span class="fa fa-chevron-left"></span>
              </th>
              <th class="cvf-date-day-info cvf-date-head-info" colspan="5"></th>
              <th class="cvf-date-day-next next-arrow">
                 <span class="fa fa-chevron-right"></span>
              </th>
          </tr>
          <tr class="cvf-date-day-headinfo">
              <th>Sun</th>
              <th>Mon</th>
              <th>Tue</th>
              <th>Wen</th>
              <th>Thr</th>
              <th>Fri</th>
              <th>Sat</th>
          </tr>
        </thead>   
      </table>
  `)
    this.$dayBodyPanel=$(' <tbody class="cvf-date-day-body"></tbody>')
    this.$dayPanel.append(this.$dayBodyPanel)
  }

  createDateMonthPanel(){
    this.$monthPanel=$(`
      <table>
        <thead>
          <tr class="cvf-date-month-head-action">
              <th class="cvf-date-month-prev prev-arrow">
                <span class="fa fa-chevron-left"></span>
              </th>
              <th class="cvf-date-month-info cvf-date-head-info" colspan="5"></th>
              <th class="cvf-date-month-next next-arrow">
                <span class="fa fa-chevron-right"></span>
              </th>
          </tr>
        </thead>   
      </table>
  `)
    this.$monthBodyPanel=$(' <tbody class="cvf-date-month-body"></tbody>')
    this.$monthPanel.append(this.$monthBodyPanel)
  }

  createDateYearPanel(){
    this.$yearPanel=$(`
      <table>
        <thead>
          <tr class="cvf-date-year-head-action">
              <th class="cvf-date-year-prev prev-arrow">
                <span class="fa fa-chevron-left"></span>
              </th>
              <th class="cvf-date-year-info cvf-date-head-info" colspan="5"></th>
              <th class="cvf-date-year-next next-arrow">
                <span class="fa fa-chevron-right"></span>
              </th>
          </tr>
        </thead>   
      </table>
  `)
    this.$yearBodyPanel=$(' <tbody class="cvf-date-year-body"></tbody>')
    this.$yearPanel.append(this.$yearBodyPanel)
  }
}
