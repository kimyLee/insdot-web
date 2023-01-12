// import { runSample } from '@/lib/blockly/blocks/preBlock'

// export const pureCanvas = '<xml xmlns="https://developers.google.com/blockly/xml"><variables><variable id="?3U;%e-F`beKTnGkyWPA">value</variable></variables><block type="setUp" id="hYtIewSkz:6WqAz~P5lt" x="90" y="50"></block><block type="procedures_defnoreturn" id=":1.cYyqLE85HpPfX8DcK" x="90" y="450"><mutation><arg name="value" varid="?3U;%e-F`beKTnGkyWPA"></arg></mutation><field name="NAME">When_JOYO_Read</field><comment pinned="false" h="80" w="160">Describe this function...</comment></block></xml>'

// export const runSample = '<xml xmlns="https://developers.google.com/blockly/xml"><variables><variable id="?3U;%e-F`beKTnGkyWPA">value</variable></variables><block type="setUp" id="hYtIewSkz:6WqAz~P5lt" x="90" y="50"><statement name="main"><block type="set_light_animation" id="t4+;$eU#Snl!e.N{$q=T"><field name="animation">run</field><field name="NAME">0</field><field name="color">0xffffff</field></block></statement></block><block type="procedures_defnoreturn" id=":1.cYyqLE85HpPfX8DcK" x="90" y="230"><mutation><arg name="value" varid="?3U;%e-F`beKTnGkyWPA"></arg></mutation><field name="NAME">When_JOYO_Read</field><comment pinned="false" h="80" w="160">Describe this function...</comment></block></xml>'

// import pureCanvas from './pureCanvas.xml'
// import runSample from './runSample.xml'

const runSample = '{"blocks":{"languageVersion":0,"blocks":[{"type":"procedures_defnoreturn","id":"Vi7]U)=bzFF5hocm(/#n","x":30,"y":230,"extraState":{"params":[{"name":"value","id":"A[^TV%Y{V^QvxHnM[LP3"}]},"icons":{"comment":{"text":"Describe this function...","pinned":false,"height":80,"width":160}},"fields":{"NAME":"JOYO扫描到"}},{"type":"setUp","id":"Svt8=*!d}zLut^KJCU0F","x":30,"y":90,"inputs":{"main":{"block":{"type":"set_light_animation","id":"0Y%ea+28}(*X^740ow/L","fields":{"animation":"run","NAME":0,"color":"0xffffff"}}}}}]},"variables":[{"name":"var","id":"^48CI*13(Wzy=fo4sNos","type":"VAR"},{"name":"list","id":"gZ{g7Ki)!834LpNhd=Xh","type":"LIST"},{"name":"value","id":"A[^TV%Y{V^QvxHnM[LP3"}]}'
const pureCanvas = '{"blocks":{"languageVersion":0,"blocks":[{"type":"procedures_defnoreturn","id":"Vi7]U)=bzFF5hocm(/#n","x":30,"y":230,"extraState":{"params":[{"name":"value","id":"A[^TV%Y{V^QvxHnM[LP3"}]},"icons":{"comment":{"text":"Describe this function...","pinned":false,"height":80,"width":160}},"fields":{"NAME":"JOYO扫描到"}},{"type":"setUp","id":"Svt8=*!d}zLut^KJCU0F","x":30,"y":90}]},"variables":[{"name":"var","id":"^48CI*13(Wzy=fo4sNos","type":"VAR"},{"name":"list","id":"gZ{g7Ki)!834LpNhd=Xh","type":"LIST"},{"name":"value","id":"A[^TV%Y{V^QvxHnM[LP3"}]}'
export {
  pureCanvas,
  runSample,
}
