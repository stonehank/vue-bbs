import {highLightEle} from "./index";

export default function bindATagSmoothScroll(ev){
  ev.preventDefault();
  let target=ev.target
  if(target.nodeName!=='A')return
  if(!target.getAttribute('href').startsWith('#'))return
  let ele=document.getElementById(target.getAttribute('href').slice(1))
  if(!ele)return
  // todo Compatible?
  ele.scrollIntoView({
    behavior: 'smooth'
  });
  highLightEle(ele.getElementsByClassName('bbs-msg-body')[0])
}
