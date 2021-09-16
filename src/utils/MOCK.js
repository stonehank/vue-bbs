const Mock = require('mockjs')
const {Random}=Mock

let objectIdIndex={}
let objectIdBox=[]
let pool= "abcdefghijklmnopqrstuvwxyz"
    + "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    + "0123456789"

function createNormalData(counts=100,reply=200,nest=3){
  let list= Mock.mock({
    [`list|${counts}`]: [{
      nickname: '@name',
      'objectId': `@string(${pool},32)`,
      message: '@sentence',
      link: '@url("http")',
      at: '',
      rootId:'',
      replyId:'',
      avatar: 'https://picsum.photos/@integer(60, 120)',
    }]
  }).list
  // console.log(list)
  list=list.map((obj)=>{
    objectIdIndex[obj.objectId]=obj
    objectIdBox.push(obj.objectId)
    let date=Random.datetime()
    date=new Date(date).toISOString()
    obj.createdAt=date
    obj.updatedAt=date
    return obj
  })
  let replyLists=createReplyData(reply,nest)
  return list.concat(replyLists)
}

function createReplyData(counts=500,times=2){
  let lastIdIndex=objectIdIndex
  let lastIdBox=objectIdBox
  let replyIdIndex={}
  let replyIdBox=[]
  let replyList=[]
  for(let i=0;i<times;i++){
    for(let j=0;j<counts;j++){
      let _replyId=lastIdBox[~~(Math.random() * lastIdBox.length)]
      let _replyObj=lastIdIndex[_replyId]
      // console.log(_replyId,'---\n',lastIdIndex)
      let oldDate_time=new Date(_replyObj.createdAt).getTime()
      let newDate=new Date(oldDate_time + 5000 + ~~(Math.random() * 1000000)).toISOString()
      let obj={
        nickname: Random.name(),
        'objectId': Random.string(pool,32),
        message:`@${_replyObj.nickname} ${Random.sentence()}`,
        link: Random.url("http"),
        at: _replyObj.nickname,
        rootId:_replyObj.rootId || _replyObj.objectId,
        replyId:_replyId,
        avatar: `https://picsum.photos/${Random.integer(60, 120)}`,
        createdAt:newDate,
        updatedAt:newDate,
      }
      replyIdIndex[obj.objectId]=obj
      replyIdBox.push(obj.objectId)
      replyList.push(obj)
    }
    lastIdIndex=replyIdIndex
    replyIdIndex={}
    lastIdBox=replyIdBox
    replyIdBox=[]
  }
  return replyList
}

/*
*
*       rootId: '',
      replyId: '',
* */


module.exports={
  createNormalData
}
