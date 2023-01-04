
// // todo: blockly 类型
import Blockly from 'blockly'
import { javascriptGenerator } from 'blockly/javascript'

javascriptGenerator.play_audio = function (block: any) {
  const dropdown_name = block.getFieldValue('NAME')
  return 'blePlayMusic("' + dropdown_name + '");\n'
}
