import obj from './index'

const LANG = {} as (typeof obj)

const temp: any = obj
for (const i in temp) {
  if (typeof temp[i] !== 'string') {
    (LANG as any)[i] = {} as any
    for (const j in temp[i]) {
      (LANG as any)[i][j] = `${i}.${j}`
    }
  } else {
    (LANG as any)[i] = i
  }
}

export default LANG
