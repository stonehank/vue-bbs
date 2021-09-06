export default function createInputInside(self,{
  $curEle,$container,dataObj,idx,otpOptions
}={}){
  $curEle[0].className='cvf-valid-field'
  $container.append($curEle)
  if(otpOptions){
    /*
      otp1:{
        otpCount:4,
        sendAPI:'',
        verifyAPI:''
      }
    */
    let $otpBtn=$('<span class="cvf-otp-btn">Verify</span>')
    $container.append($otpBtn)
  }
  if(dataObj.result)self.dirty[idx]=true
  let {showClearBtn,hideClearBtn}=self.addClearBtn($container,$curEle,dataObj)
  self.bindValidateEvent($curEle,dataObj,idx,showClearBtn,hideClearBtn)
}
