import 'blueimp-gallery/js/jquery.blueimp-gallery'
// import 'blueimp-gallery/css/blueimp-gallery.css'
// import '../css/blueimp-gallery.scss'
import createTextFieldHtmlObj from '../insert/createTextFieldHtmlObj'
import CreateValidateElement from './CreateValidateElement'
import createGallery from '../insert/file/createGallery'
import createFileInside from '../insert/file/createFileInside'


class CreateValidateFile extends CreateValidateElement{
  constructor({
    ele = null,
    rules = [],
    material = true,
    showSuccess = true,
    uploadOptions={},
  } = {}) {
    super({
      ele,
      rules,
      material,
      showSuccess,
    })
    this.uploadOptions=uploadOptions
    this.init()
  }
  
  insertElement($wrapper,$curEle,idx){
    if(this.uploadOptions.thumbnail){
      createGallery()
    }
    const [$container,dataObj]=createTextFieldHtmlObj(this,{$wrapper,$curEle,idx})
    createFileInside(this,{
      $curEle,$container,dataObj,idx,uploadOptions:this.uploadOptions
    })
  }
}

export default CreateValidateFile
