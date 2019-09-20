export const password = (rule, value, callback) => {
  let reg = /^[a-zA-Z0-9]{8,16}$/
  if (!reg.test(value)) {
    callback(new Error('名称为8-16字符，只能包含数字、大小写英文字符'))
  } else {
    callback()
  }
}

export const name = (rule, value, callback) => {
  let reg = /^[a-zA-Z0-9|_]{1,64}$/
  if (!reg.test(value)) {
    callback(new Error('名称为1-64个字符，只能包含数字、英文字符，或 “_”'))
  } else {
    callback()
  }
}
