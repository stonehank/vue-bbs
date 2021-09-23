// import XssFilter from './xssFilter'
import {escape} from './escape'
const xss = require("xss");
const marked = require('marked');

const  hljs =require('highlight.js/lib/highlight');
const javascript = require('highlight.js/lib/languages/javascript');
const xml = require('highlight.js/lib/languages/xml');

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('xml', xml);

function createMarked(hljs){
  marked.setOptions({
    highlight: function(str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return '<pre class="hljs"><code>' +
            hljs.highlight(lang, str, true).value +
            '</code></pre>';
        } catch (__) {
          // do nothing
        }
      }
      return '<pre class="hljs"><code>' + escape(str) + '</code></pre>';
    }
  });
  return (mdStr)=>{
    return marked(mdStr)
  }
}
let markdown=createMarked(hljs)



function modify_hljs(createHljs){
  createHljs=createHljs.bind(null,hljs)
  let _hljs=createHljs()
  if(!_hljs){
    _hljs=hljs
    console.warn("Forgot to return hljs ? If not, something might be wrong.")
  }
  markdown=createMarked(_hljs)
}
window.xss=xss
function xssMarkdown(content){
  if(!content)return ''
  // console.log(content)
  // return markdown(xss(content))
  console.log(markdown(content))
  return xss(markdown(content),{
    whiteList:{
      ...xss.whiteList,
      span: ['class'],
      code: ['class'],
      pre: ['class'],
    },
    onTag:function(tag,html){
      if(tag==='input'){
        if(html.includes('type="checkbox"') && html.includes('disabled')){
          return html
        }
      }
    },
  })
  // return XssFilter(markdown(content))
}


export {modify_hljs,xssMarkdown}









