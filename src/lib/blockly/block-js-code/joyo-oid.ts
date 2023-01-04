
// // todo: blockly 类型
import Blockly from 'blockly'
import { javascriptGenerator } from 'blockly/javascript'

javascriptGenerator.receive_letter = function (block: any) {
  const dropdown_name = block.getFieldValue('NAME')
  // TODO: Assemble JavaScript into code variable.
  return [dropdown_name, javascriptGenerator.ORDER_NONE]
}
javascriptGenerator.receive_number = function (block: any) {
  const dropdown_name = block.getFieldValue('NAME')
  // TODO: Assemble JavaScript into code variable.
  return [dropdown_name, javascriptGenerator.ORDER_NONE]
}
javascriptGenerator.receive_symbol = function (block: any) {
  const dropdown_name = block.getFieldValue('NAME')
  // TODO: Assemble JavaScript into code variable.
  return [dropdown_name, javascriptGenerator.ORDER_NONE]
}
javascriptGenerator.receive_card = function (block: any) {
  const dropdown_name = block.getFieldValue('NAME')
  // TODO: Assemble JavaScript into code variable.
  return [dropdown_name, javascriptGenerator.ORDER_NONE]
}
javascriptGenerator.receive_color = function (block: any) {
  const dropdown_name = block.getFieldValue('NAME')
  // TODO: Assemble JavaScript into code variable.
  return [dropdown_name, javascriptGenerator.ORDER_NONE]
}
