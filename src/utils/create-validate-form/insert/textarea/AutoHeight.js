
export default class AutoHeight{
  constructor({
    rows=1,
    textarea=null
  }){
    if(!textarea){
      throw new Error('Need valid element!')
    }
    this.rows=rows
    // this.placeholder=placeholder
    this.root=textarea
    this.calcHeight=this.calcHeight.bind(this)
    this.init()
  }

  init(){
    this.render()
    this.autoHeight()
  }

  autoHeight(){
    this.root.addEventListener('input',this.calcHeight)
  }

  calcHeight(){
    this.root.style.height='auto'
    this.root.style.height=`${this.root.scrollHeight+2}px`
  }


  render(){
    this.root.setAttribute('rows',this.rows)
    this.root.className+=' auto-height-textarea-root'
  }
}
