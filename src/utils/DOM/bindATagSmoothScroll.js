import {highLightEle} from "./index";

export default function bindATagSmoothScroll(ev){
  let target=ev.target
  if(target.nodeName!=='A' || target.className!=='bbs-at')return
  if(!target.getAttribute('href').startsWith('#'))return
  ev.preventDefault();
  let ele=document.getElementById(target.getAttribute('href').slice(1))
  if(!ele)return
  // todo Compatible?
  ele.scrollIntoView({
    behavior: 'smooth'
  });
  highLightEle(ele.getElementsByClassName('bbs-msg-body')[0])
}
