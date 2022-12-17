
import Blockly from 'blockly'

Blockly.JavaScript.setUp = function (block: any) {
  const branchCode = Blockly.JavaScript.statementToCode(block, 'main')
  return 'function setUp() {\n' + branchCode + '}\nsetUp();\n'
}

Blockly.JavaScript.wait_second = function (block: any) {
  const number_name = block.getFieldValue('NAME')
  return 'sleepFn(' + number_name + ');\n'
}
Blockly.JavaScript.consolelog = function (block: any) {
  // const number_name = block.getFieldValue('NAME')
  const variable_name = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('NAME'), 'VARIABLE')
  return 'print("' + variable_name + '", JSON.stringify(' + variable_name + '));\n'
}
Blockly.JavaScript.printany = function (block: any) {
  // const number_name = block.getFieldValue('NAME')
  const value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC)
  // TODO: Assemble JavaScript into code variable.
  const code = 'print(' + value_name + ');\n'
  return code
}
Blockly.JavaScript.date_now = function (block: any) {
  return ['getDateNow()', Blockly.JavaScript.ORDER_NONE]
}
