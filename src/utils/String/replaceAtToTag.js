import {escape} from "./escape";

export default function replaceAtToTag(content,replyId="_",replyName=''){
  if(!replyId)replyId='_'
  let matchReg=new RegExp(`^@${replyName}\\s`)
  let m=content.match(matchReg)
  // console.log(content,replyId,replyName)
  if(!m)return content
  let escapeName=escape(replyName)
  // console.log(content)
  return content.replace(matchReg,`<a class="at" href="#${replyId}">@${escapeName}</a>&nbsp;`)
  // return content.replace(/^(@[^\s\t\n\r]+)\s/,`[@${escapeName}](#${replyId})`)
}
