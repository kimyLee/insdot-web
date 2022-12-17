
// // todo: blockly 类型
import Blockly from 'blockly'

Blockly.JavaScript.play_audio = function (block: any) {
  const dropdown_name = block.getFieldValue('NAME')
  return 'blePlayMusic("' + dropdown_name + '");\n'
}
