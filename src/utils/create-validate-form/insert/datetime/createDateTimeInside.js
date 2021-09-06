import Datetimepicker from './CreateDatetimepicker'

export default function createDateTimeInside(self,{
  $curEle, $container, dataObj, idx, type
} = {}) {
  let allowFrom = $curEle.attr('data-cvf-from')
  let allowTo = $curEle.attr('data-cvf-to')
  let initDate = $curEle.attr('data-cvf-initDate')
  let initView = $curEle.attr('data-cvf-initView')
  let initHour = $curEle.attr('data-cvf-initHour')
  let initMinute = $curEle.attr('data-cvf-initMinute')
  $curEle.attr('type', 'text')
  $curEle[0].className = 'cvf-valid-field'
  // 避免 autofill
  $curEle.attr('readonly', 'readonly')
  $container.append($curEle)

  let {showClearBtn, hideClearBtn} = self.addClearBtn($container, $curEle, dataObj)

  let params = {
    $curEle,
    $container,
    initDate,
    initHour,
    initMinute,
    timePanel: false,
    minView: 'day',
    format: 'yyyy-mm-dd, ddd',
    initView,
    allowedDate: {from: allowFrom, to: allowTo},
    selectedDate: (chooseDate) => {
      self.elementData[idx].result = chooseDate
      showClearBtn()
    },
    opened: () => {
    },
    closed: () => {
    }
  }
  if (type === 'time') {
    params.datePanel = false
    params.timePanel = true
    params.minView = 'time'
    params.format = 'HH:MM'
    params.selectedDate = () => {
    }
    params.selectedTime = (hour, minute) => {
      showClearBtn()
      self.elementData[idx].result = `${hour}:${minute}`
    }
  } else if (type === 'datetime') {
    params.timePanel = true
    params.minView = 'time'
    params.format = 'yyyy-mm-dd, ddd, HH:MM'
  }

  dataObj.reset = () => {
    $curEle.val('')
    dataObj.result = null
    dataObj.dirty = null
    hideClearBtn()
  }
  console.log(type,params)
  new Datetimepicker(params)

  self.bindValidateEvent($curEle, dataObj, idx, showClearBtn, hideClearBtn)
}
