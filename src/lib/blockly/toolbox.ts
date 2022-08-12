// 暴露toolbox的json
import logic from './logic'
import loop from './loop'
import math from './math'
import list from './list'
import text from './text'
import variables from './variables'
import procedures from './procedures'
import joyo from './joyo'

const basicCategories = {
  kind: 'categoryToolbox',
  contents: [
    logic,
    loop,
    math,
    variables,
    list,
    text,
    procedures,
    joyo,
  ],
}

export default basicCategories
