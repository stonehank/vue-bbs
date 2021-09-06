import 'dm-file-uploader'
export default function bindSelectEvent(self,{
  $label,$curEle,dataObj,$fileThumbnail,idx,options
}={}){
  if(options.url==null){
    throw new Error('Must Provide URL')
  }
  if(options.noBackend){
    console.warn('For convenient, using no-backend mode, anything you upload will response a random image #_#')
    options.convertResponseToPath=() => `https://picsum.photos/id/${Math.ceil(Math.random()*200)}/200/200`
  }
  if (typeof options.convertResponseToPath !== 'function') {
    throw new Error('Must provide <convertResponseToPath> Function, which parameter are [id, data], and need to return the real path<String|Array>')
  }
  dataObj.reset=() => {
    dataObj.dirty=false
    dataObj.result=null
    render()
  }

  setTimeout(() => {
    self._elementBlur(idx)
  },0)
  if(dataObj.isDisabled){
    return
  }
  let defaultThumbnailOpt={
    width: 48,
    height: 48,
    margin: 4,
    padding: 4,
  }
  if(options.thumbnail) {
    if(Object.prototype.toString.call(options.thumbnail)!=='[object Object]'){
      options.thumbnail=defaultThumbnailOpt
    }else{
      options.thumbnail=Object.assign(defaultThumbnailOpt,options.thumbnail)
    }
  }
  let fileNameList=[]
  $label.on('click', () => setTimeout(() => self._elementFocus(idx),0))
  $label.on('mouseleave', () => setTimeout(() => self._elementBlur(idx),0))

  // window.r=() => { self._elementBlur(idx) }
  $curEle.dmUploader({
    url: options.url,
    maxFiles:options.maxFiles,
    dnd:options.dnd,
    multiple:options.multiple,
    method:options.method,
    extraData:options.extraData,
    headers:options.headers,
    dataType:options.dataType,
    maxFileSize:options.maxFileSize,
    allowedTypes:options.allowedTypes,
    thumbnail:options.thumbnail,
    onInit:options.onInit,
    onUploadSuccess(id,data){
      let path=options.convertResponseToPath()
      if(!Array.isArray(path)){
        path=[path]
      }
      if(!Array.isArray(dataObj.result)){
        dataObj.result=[]
      }

      dataObj.result=dataObj.result.concat(path)
      render(options.thumbnail)
      setTimeout(() => {
        self._elementFocus(idx)
        self._elementBlur(idx)
      },200)
      return options.onUploadSuccess(id,data)
    },
    onUploadComplete(id){
      if(options.noBackend){
        let path=options.convertResponseToPath()
        if(!Array.isArray(path)){
          path=[path]
        }
        if(!Array.isArray(dataObj.result)){
          dataObj.result=[]
        }

        dataObj.result=dataObj.result.concat(path)
        render(options.thumbnail)
        setTimeout(() => {
          self._elementFocus(idx)
          self._elementBlur(idx)
        },200)
      }
      return options.onUploadSuccess(id)
    },
    onComplete:options.onComplete,
    onFallbackMode:options.onFallbackMode,
    onNewFile:(id,file) => {
      fileNameList.push(file.name)
      return options.onNewFile(id,file)
    },
    onUploadCanceled:(id,file) => {
      fileNameList.pop()
      return options.onUploadCanceled(id,file)
    },
    onUploadError:(id,file) => {
      if(!options.noBackend)fileNameList.pop()
      return options.onUploadError(id,file)
    },
    onBeforeUpload:options.onBeforeUpload,
    onUploadProgress:options.onUploadProgress,
    onFileTypeError:options.onFileTypeError,
    onFileSizeError:options.onFileSizeError,
    onFileExtError:options.onFileExtError,
    onDragEnter:options.onDragEnter,
    onDragLeave:options.onDragLeave,
    onDocumentDragEnter:options.onDocumentDragEnter,
    onDocumentDragLeave:options.onDocumentDragLeave,
  })

  function render(showThumbnail){
    $fileThumbnail.html('')
    $label.html('')
    if(!Array.isArray(dataObj.result))return
    for(let i=0; i<dataObj.result.length; i++){
      let curPath=dataObj.result[i]
      let curName=fileNameList[i]
      let fileType=detectPath(curPath)
      let $uploadFileTag=$('<div class="cvf-upload-tag"></div>')
      let $thumbnail=$('<div class="cvf-thumbnail"></div>')
      let $closeBtn=$('<span class="cvf-thumbnail-close">x</span>')
      let $closeBtnSm=$('<span class="cvf-thumbnail-close-sm">x</span>')
      $uploadFileTag.append($closeBtnSm)
      $uploadFileTag.append($(`<span>${curName}</span>`))
      $closeBtnSm.on('click',function(ev){
        ev.stopPropagation()
        ev.preventDefault()
        let index=$('.cvf-thumbnail-close-sm').index(this)
        dataObj.result.splice(index,1)
        fileNameList.splice(index,1)
        if(showThumbnail)$thumbnail.remove()
        $uploadFileTag.remove()
        setTimeout(() => {
          self._elementFocus(idx)
          self._elementBlur(idx)
        },200)
      })
      if(showThumbnail){
        $closeBtn.on('click',function(ev){
          ev.stopPropagation()
          ev.preventDefault()
          let index=$('.cvf-thumbnail-close').index(this)
          dataObj.result.splice(index,1)
          fileNameList.splice(index,1)
          $thumbnail.remove()
          $uploadFileTag.remove()
          setTimeout(() => {
            self._elementFocus(idx)
            self._elementBlur(idx)
          },200)
        })
        $thumbnail.append($closeBtn)
        $thumbnail.css(options.thumbnail)
        if(fileType==='image'){
          let $img=$(`<a href="${curPath}" title="${curName}" data-gallery><img src="${curPath}" alt="${curName}" /></a>`)
          $thumbnail.addClass('cvf-img-thumbnail')
          $thumbnail.append($img)
        }else if(fileType==='file'){
          $thumbnail.addClass('cvf-file-thumbnail')
          $thumbnail.text('FILE')
        }else{
          $thumbnail.addClass('cvf-other-thumbnail')
          $thumbnail.css({
            lineHeight:options.thumbnail.height
          })
          $thumbnail.text(curPath)
        }
        $fileThumbnail.append($thumbnail)
      }
      $label.append($uploadFileTag)
    }
  }
}

function detectPath(path){
  if(!path)return 'other'
  if(/(\.pdf|\.PDF|\.xls|\.doc|\.txt)$/.test(path)){
    return 'file'
  }
  if(/(.*?)(\.png|\.jpg|\.jpeg|\.gif)/i.test(path) || /^http/.test(path))return 'image'
  return 'other'
}
