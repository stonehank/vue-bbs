import $ from 'jquery'
import bindFileEvent from './bindFileEvent'

export default function createFileInside(self,{
  $curEle, $container, dataObj, idx,uploadOptions
}={}){
  $curEle.attr('hidden',true)
  let eleID=$curEle.attr('id')
  if(!eleID){
    eleID=`file-upload-${idx}`
    $curEle.attr('id',eleID)
  }
  let $label=$(`<label class="cvf-upload-label" for="${eleID}"></label>`)
  let $fileThumbnail=$('<div class="cvf-upload-thumbnail-wrapper"></div>')
  $label.addClass('cvf-valid-field d-flex flex-wrap')
  $label.css({
    minHeight: 34.4,
  })
  let defaultOptions={
    maxFiles:0,
    dnd: true,
    multiple: true,
    url: null,
    method: 'POST',
    extraData: {},
    headers: {},
    dataType: null,
    maxFileSize: 0,
    allowedTypes: '*',
    thumbnail:false,
    convertResponseToPath:null,
    onInit(){},
    onComplete(){},
    onFallbackMode() {},
    onNewFile(){}, // params: id, file
    onBeforeUpload(){}, // params: id
    onUploadProgress(){}, // params: id, percent
    onUploadSuccess(){}, // params: id, data
    onUploadCanceled(){}, // params: id
    onUploadError(){}, // params: id, xhr, status, message
    onUploadComplete(){}, // params: id
    onFileTypeError(){}, // params: file
    onFileSizeError(){}, // params: file
    onFileExtError(){}, // params: file
    onDragEnter(){},
    onDragLeave(){},
    onDocumentDragEnter(){},
    onDocumentDragLeave(){}
  }
  let finalOptions=Object.assign(defaultOptions,uploadOptions)

  bindFileEvent(self,{
    $label,$curEle,dataObj,$fileThumbnail,idx,options:finalOptions
  })
  $container.append($label)
  $container.append($curEle)
  $container.after($fileThumbnail)
  // console.log(self, $curEle, $container, dataObj, idx,eleName)
}
