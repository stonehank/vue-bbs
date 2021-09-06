// import selectHideDropdown from './selectHideDropdown'

export default function selectShowDropdown(self,{$selectOptCont,idx,$selectResult}){
  if(self.showDropDownIdx===idx)return
  // selectHideDropdown(self,self.showDropDownIdx)
  self._elementFocus(idx)
  self.showDropDownEle=$selectOptCont
  self.showDropDownIdx=idx
  // self.showDropDownEle.css({
  //   pointerEvents:'auto'
  // })
  let {top,left}=$selectResult.offset()
  self.showDropDownEle.css({
    display:'block',
  })
  self.showDropDownEle.css({
    top,
    left,
    transform:`translateY(${$selectResult.outerHeight()}px)`
  })
  self.showDropDownEle.addClass('cvf-show-select')
}
