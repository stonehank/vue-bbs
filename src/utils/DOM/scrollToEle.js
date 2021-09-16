import {highLightEle} from "./index";

export default function scrollToEle(ele, {
    highlight=false,
    smooth=false
}={}) {
    if (!ele) return Promise.resolve(false)
    if (!(ele instanceof Element)) {
        ele = ele.$el
    }
    if (!(ele instanceof Element)) {
        throw new Error('Pass ele is not correct')
    }
    let parentNode = getScrollParent(ele)
    return new Promise((res)=>{
        while (parentNode) {
            scrollTo(ele, parentNode, {
                highlight,
                smooth
            })
            ele = parentNode
            parentNode = getScrollParent(parentNode)
        }
        setTimeout(()=>{
            res(true)
        },500)
    })

}


function scrollTo(target, parent, {highlight,smooth}) {
    let top = calculateTopPosition(target, parent)
    if (parent instanceof Document) {
        parent = window
    }
    if (highlight) highLightEle(target)
    try{
        parent.scrollTo({
            top: top,
            behavior:smooth ? 'smooth' : 'instant'
        })
    }catch(_){
        if(parent===window)parent=document.documentElement || document.body
        parent.scrollTop=top
    }
}

function getScrollParent(node) {
    let parentNode = node.parentNode
    if (parentNode == null) {
        return null;
    }
    if (parentNode.scrollHeight > parentNode.clientHeight) {
        return parentNode;
    } else {
        return getScrollParent(parentNode);
    }
}

function calculateTopPosition(el, target = null) {
    if(el==null || target==null)return 0
    if (el === target) return 0
    if (el.offsetParent === target.offsetParent) {
        return el.offsetTop - target.offsetTop
    } else {
        return el.offsetTop + calculateTopPosition(el.offsetParent);
    }
}
