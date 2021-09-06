import selectRenderResult from './selectRenderResult'
// import selectHideDropdown from './selectHideDropdown'

export default function selectChoose(self,{
  // eslint-disable-next-line no-unused-vars
  $selectResult,isMulti,$selectOptCont,idx
}){
  selectRenderResult(self.elementData[idx].textShow,$selectResult)
  // if(!isMulti)selectHideDropdown(self,idx)
}
