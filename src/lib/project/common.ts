
// 导出生成一个文件
export function exportFile (filename: string, text: string) {
  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
  element.setAttribute('download', filename)

  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}

// 1. 已有文件名 + 1
// 2. 支持自定义前后缀，括号 '(\()(\\d+)(\))$'
// 3. 在_2,_3基础上叠加
export function reNameRepeatFile (name: string, prefix = '_', after = '') {
  // export function reNameRepeatFile (name: string, regExp = '(_)(\\d+)$') {
  // const pat = prefix + '(\\d+)' + after + '$'
  // console.log(pat)
  // const pattern = new RegExp(prefix + '(\\d+)' + after + '$')
  // if (name.match(pattern)) { // 有拆分
  //   const str = name.replace(pat, (str, $1, $2, $3) => {
  //     console.log($1 + ($2 - 0 + 1) + $3)
  //     return $1 + ($2 - 0 + 1) + $3
  //   })
  //   console.log(str, '999')
  // }
  // return name + prefix + '1' + after
}
