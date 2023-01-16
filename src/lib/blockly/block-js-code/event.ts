
import Blockly from 'blockly'
import { javascriptGenerator } from 'blockly/javascript'

javascriptGenerator.setUp = function (block: any) {
  const branchCode = javascriptGenerator.statementToCode(block, 'main')
  return 'function setUp() {\n' + branchCode + '}\nsetUp();\n'
}

javascriptGenerator.wait_second = function (block: any) {
  // const number_name = block.getFieldValue('NAME')
  const number_name = javascriptGenerator.valueToCode(block, 'NAME', javascriptGenerator.ORDER_ATOMIC)

  return 'sleepFn(' + number_name + ');\n'
}
javascriptGenerator.consolelog = function (block: any) {
  // const number_name = block.getFieldValue('NAME')
  const variable_name = javascriptGenerator.nameDB_.getName(block.getFieldValue('NAME'), 'VARIABLE')
  return 'print("' + variable_name + '", JSON.stringify(' + variable_name + '));\n'
}
javascriptGenerator.printany = function (block: any) {
  // const number_name = block.getFieldValue('NAME')
  const value_name = javascriptGenerator.valueToCode(block, 'NAME', javascriptGenerator.ORDER_ATOMIC)
  // TODO: Assemble JavaScript into code variable.
  const code = 'print(' + value_name + ');\n'
  return code
}
javascriptGenerator.date_now = function (block: any) {
  return ['getDateNow()', javascriptGenerator.ORDER_NONE]
}
