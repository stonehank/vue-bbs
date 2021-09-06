export default function selectHideDropdown(self,idx){
  if(idx==null)return
  // console.log(self.showDropDownEle)
  self._elementBlur(idx)
  // self.showDropDownEle.css({
  //   pointerEvents:'none'
  // })
  self.showDropDownEle.removeClass('cvf-show-select')
  self.showDropDownEle.css({
    transform:'translateY(-50px)',
    display:'none'
  })
  self.showDropDownIdx=null
  self.showDropDownEle=null
}
