import {escape} from "./escape";

export default function replaceAtToTag(content,replyId="_",replyName=''){
  if(!content)return
  if(!replyId)replyId='_'
  let matchReg=new RegExp(`^@${replyName}\\s`)
  let m=content.match(matchReg)
  if(!m)return content
  let escapeName=escape(replyName)
  return content.replace(matchReg,`<a class="at" href="#${replyId}">@${escapeName}</a>&nbsp;`)
}
