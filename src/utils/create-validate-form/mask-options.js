import $ from 'jquery'
$.jMaskGlobals = {
  maskElements: 'input,td,span,div',
  dataMaskAttr: '*[data-mask]',
  dataMask: true,
  watchInterval: 300,
  watchInputs: true,
  watchDataMask: true,
  byPassKeys: [9, 16, 17, 18, 36, 37, 38, 39, 40, 91],
  translation: {
    0:null,
    9:null,
    '#': {pattern: /\d/,recursive:false},
    '?': {pattern: /\d/, optional: true},
    '*': {pattern: /\d/, recursive: true},
  },
}
