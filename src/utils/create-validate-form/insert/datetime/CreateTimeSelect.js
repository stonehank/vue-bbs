export default class CreateTimeSelect{
  constructor({
    $ele=null,
    count=12,
    initTime=0,
    showCount=7,
    selected=() => {}
  }={}){
    this.$ele=$ele
    this.count=count
    this.initTime=initTime
    this.showCount=showCount
    this.selected=selected.bind(this)
    this.$ul=$(`<ul class="cvf-select-list" data-count="${this.count}" touch-action="none"></ul>`)
    this.update(this.initTime)
    this.bindEvent()
  }

  update(middle){
    this.$ul.html('')
    let half=Math.floor(this.showCount/2)
    let first=(middle - half + this.count) % this.count

    let sizeArr=this.calcAttrArr(16,36,7)
    let weightArr=this.calcAttrArr(400,600,7)

    for(let i=0; i<this.showCount; i++){
      let cls=''
      if(i===half)cls='cvf-select-time-active'
      let $item=$(`<li class="cvf-select-item ${cls}" data-num="${first}" style="font-size:${sizeArr[i]}px;font-weight:${weightArr[i]}">${first}</li>`)
      first=(first + 1) % this.count
      this.$ul.append($item)
    }
    this.$ul.children().each((i,ele) => {
      $(ele).click(() => {
        this.selected($(ele).attr('data-num'))
      })
    })
  }

  bindEvent(){
    this.$ul.on('pointerdown',(ev) => {
      if(this.pointerMove)return
      this.pointerDown=true
      this.dy=ev.clientY
    })

    this.$ul.on('pointermove',(ev) => {
      if(!this.pointerDown)return
      this.pointerMove=true
      let my=ev.clientY
      let deltaY=my-this.dy
      if(deltaY>30){
        this.dy=my
        this.minusOne()
      }else if(deltaY<-30){
        this.dy=my
        this.addOne()
      }
    })

    $(document).on('pointerup',() => {
      this.pointerDown=false
      this.pointerMove=false
    })

    this.$ul.on('wheel',(ev) => {
      ev.preventDefault()
      let ori=Math.sign(ev.originalEvent.deltaY)
      if(ori>0){
        this.addOne()
      }else{
        this.minusOne()
      }
    })
    this.$ele.append(this.$ul)
  }

  addOne(){
    let $children=this.$ul.children()
    let count=+this.$ul.attr('data-count')
    $children.each((i,ele) => {
      let n=+$(ele).text()
      let num=(n+1) % count
      $(ele).text(num)
      $(ele).attr('data-num',num)
    })
  }

  minusOne(){
    let $children=this.$ul.children()
    let count=+this.$ul.attr('data-count')
    $children.each((i,ele) => {
      let n=+$(ele).text()
      let num=(n-1 + count) % count
      $(ele).text(num)
      $(ele).attr('data-num',num)
    })
  }

  calcAttrArr(start,end,gapCount){
    let half=Math.floor(gapCount/2)
    let gap=end-start
    let average=Math.floor(gap/half)
    let rest=gap-(average*half)
    let res=Array(gapCount).fill(0)
    for(let i=0; i<=half; i++){
      res[i]=start
      res[gapCount-i-1]=start
      let restAver=rest % half
      start=start+average+restAver
      rest-=restAver
    }
    return res
  }
}
