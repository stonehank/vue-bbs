import {escape} from "./String";

export function convertToPureMessage(atMessage,replyName){
    if(!atMessage)return atMessage
    if(!replyName)return atMessage
    let matchReg=new RegExp(`^@${replyName}\\s`)
    return atMessage.replace(matchReg,'')
}

export function convertToAtMessage(pureMessage,replyName){
    if(!replyName)return pureMessage
    return `@${replyName} ${pureMessage}`
}

export function addAtHTMLTag(xssHTMLMsg,replyId='_',replyName){
    if(!replyName)return xssHTMLMsg
    let escapeName=escape(replyName)
    return `<a class="bbs-at" href="#${replyId}">@${escapeName}</a> ${xssHTMLMsg}`
}

// export function renderAtMessage(atMessage,replyId="_",replyName=''){
//     if(!atMessage)return
//     if(!replyId)replyId='_'
//     let matchReg=new RegExp(`^@${replyName}\\s`)
//     let m=atMessage.match(matchReg)
//     if(!m)return atMessage
//     let escapeName=escape(replyName)
//     return atMessage.replace(matchReg,`<a class="at" href="#${replyId}">@${escapeName}</a>&nbsp;`)
// }
