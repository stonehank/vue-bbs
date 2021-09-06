const verifyDetails={
  date:(v) => !!v && new Date(v).toDateString()!=='Invalid Date',
  allowDate:(v,from,to) => {
    let curTime=new Date(v).getTime()
    let fromTime=null
    let toTime=null
    if(from==null)fromTime=-Infinity
    else fromTime=new Date(from).getTime()
    if(to==null) toTime=-Infinity
    else toTime=new Date(to).getTime()
    if(fromTime>toTime){
      return curTime>=fromTime || curTime<=toTime
    }
    return curTime>=fromTime && curTime<=toTime
  },
  email:(v) => !!v && /.+@.+\..+/.test(v),
  phone:(v) => !!v && /\d{3}-\d{3}-\d{4}/.test(v),
  postcode:(v) => !!v && /^[0-9]{5,6}$/.test(v),
  required:(v) => !!v && /^[\s\S]*.*[^\s][\s\S]*$/.test(v),
  number:(v) => !!v && /^[0-9]*$/.test(v),
  atMost:(v,num) => !!v && v.length<=num,
  atLeast:(v,num) => !!v && v.length>=num,
  lessThan:(v,num) => !!v && v<=num,
  moreThan:(v,num) => !!v && v>=num,
  atLeast1Lowercase:(v) => !!v && /[a-z]/.test(v),
  atLeast1Uppercase:(v) => !!v && /[A-Z]/.test(v),
  atLeast1Number:(v) => !!v && /\d/.test(v),
}

const verifyMsg={
  date:() => 'Need valid date',
  allowDate:(from,to) => `Must in allow date, from ${new Date(from).toLocaleDateString()}, to ${new Date(to).toLocaleDateString()}`,
  email:() => 'Need valid email',
  phone:() => 'Need valid phone number',
  postcode:() => 'Need valid postcode',
  required:(name) => `${name} is required`,
  number:() => 'Must be Number',
  atMost:(num) => `At most ${num} character`,
  atLeast:(num) => `At least ${num} character`,
  lessThan:(num) => `Must less than ${num}`,
  moreThan:(num) => `Must more than ${num}`,
  maxFilesExceed:(num) => `Can not provide more than ${num} files.`,
  invalidFileType:(fileType) => `Only can provide one of type ${fileType}`,
  atLeast1Lowercase:() => 'At least one lowercase',
  atLeast1Uppercase:() => 'At least one uppercase',
  atLeast1Number:() => 'At least one number',
  accountNumber:() => 'Need valid Account Number',
  cardNumber:() => 'Need valid Card Number',
  cvv:() => 'Need valid CVV code'
}

const commonValidate={
  required:(name) => (v) => verifyDetails.required(v) || verifyMsg.required(name),
  number:() => (v) => verifyDetails.number(v) || verifyMsg.number(),
  atMost:(num) => (v) => verifyDetails.atMost(v,num) || verifyMsg.atMost(num),
  date:() => (v) => verifyDetails.date(v) || verifyMsg.date(),
  allowDate:(from,to) => (v) => verifyDetails.allowDate(v,from,to) || verifyMsg.allowDate(from,to),
  atLeast:(num) => (v) => verifyDetails.atLeast(v,num) || verifyMsg.atLeast(num),
  lessThan:(num) => (v) => verifyDetails.lessThan(v,num) || verifyMsg.lessThan(num),
  moreThan:(num) => (v) => verifyDetails.moreThan(v,num) || verifyMsg.moreThan(num),
  atLeast1Lowercase:() => (v) => verifyDetails.atLeast1Lowercase(v) || verifyMsg.atLeast1Lowercase(),
  atLeast1Uppercase:() => (v) => verifyDetails.atLeast1Uppercase(v) || verifyMsg.atLeast1Uppercase(),
  atLeast1Number:() => (v) => verifyDetails.atLeast1Number(v) || verifyMsg.atLeast1Number()
}

const verifyRules={
  username:[
    commonValidate.required('Username'),
    commonValidate.atMost(16)
  ],
  password:[
    commonValidate.required('Password'),
    (v) => (v.length>=8 && !!v.match(/[A-Z]/g) && !!v.match(/[a-z]/g) && !!v.match(/[0-9]/g)) || 'Password must be at least 8 characters and contain at least one capital letter, one lower case letter, and one number. '
  ],
  email:[
    commonValidate.required('Email'),
    (v) => verifyDetails.email(v) || verifyMsg.email()
  ],
  phone:[
    commonValidate.required('Phone'),
    (v) => verifyDetails.phone(v) || verifyMsg.phone()
  ],
  msg:[
    commonValidate.required('Message'),
  ],
  singleSelect:[
    commonValidate.required('Single Select')
  ],
  multiSelect:[
    commonValidate.required('Multiple Select')
  ],
  required:[
    commonValidate.required('This field')
  ],
  disabled:[
    null
    // commonValidate.required('Disabled')
  ],
  date:(from,to) => [
    commonValidate.date(),
    commonValidate.allowDate(from,to)
  ],
}
window.verifyRules=verifyRules

export {
  verifyRules,
  verifyDetails,
  verifyMsg
}
