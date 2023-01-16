// 暴露toolbox的json
import logic from './logic'
import loop from './loop'
import math from './math'
import list from './list'
import listCustom from './listCustom'
import text from './text'
import variables from './variables'
import procedures from './procedures'
import joyoLight from './joyo-light'
import joyoAudio from './joyo-audio'
import joyoOid from './joyo-oid'
import tool from './tool'
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
    // text,
    variables,
    list,
    procedures,
    tool,
  ],
}

export default basicCategories
