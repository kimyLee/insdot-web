
// // todo: blockly 类型
import Blockly from 'blockly'

Blockly.JavaScript.receive_letter = function (block: any) {
  const dropdown_name = block.getFieldValue('NAME')
  // TODO: Assemble JavaScript into code variable.
  return [dropdown_name, Blockly.JavaScript.ORDER_NONE]
}
Blockly.JavaScript.receive_number = function (block: any) {
  const dropdown_name = block.getFieldValue('NAME')
  // TODO: Assemble JavaScript into code variable.
  return [dropdown_name, Blockly.JavaScript.ORDER_NONE]
}
Blockly.JavaScript.receive_symbol = function (block: any) {
  const dropdown_name = block.getFieldValue('NAME')
  // TODO: Assemble JavaScript into code variable.
  return [dropdown_name, Blockly.JavaScript.ORDER_NONE]
}
Blockly.JavaScript.receive_card = function (block: any) {
  const dropdown_name = block.getFieldValue('NAME')
  // TODO: Assemble JavaScript into code variable.
  return [dropdown_name, Blockly.JavaScript.ORDER_NONE]
}
Blockly.JavaScript.receive_color = function (block: any) {
  const dropdown_name = block.getFieldValue('NAME')
  // TODO: Assemble JavaScript into code variable.
  return [dropdown_name, Blockly.JavaScript.ORDER_NONE]
}
