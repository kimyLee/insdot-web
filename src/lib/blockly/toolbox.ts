// 暴露toolbox的json
import logic from './logic'
import loop from './loop'
import math from './math'
import list from './list'
import text from './text'
import variables from './variables'
import procedures from './procedures'
import joyoLight from './joyo-light'
import joyoAudio from './joyo-audio'
import joyoOid from './joyo-oid'
// import joyo from './joyo'
// import joyo from './joyo'
// import joyo from './joyo'

const basicCategories = {
  kind: 'categoryToolbox',
  contents: [
    joyoLight,
    joyoAudio,
    joyoOid,
    logic,
    loop,
    math,
    variables,
    list,
    text,
    procedures,
  ],
}

export default basicCategories
