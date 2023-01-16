
import { javascriptGenerator } from 'blockly/javascript'

javascriptGenerator.variables_get_list = javascriptGenerator.variables_get

javascriptGenerator.variables_set_list = javascriptGenerator.variables_set

javascriptGenerator.list_push = function (block: any) {
  // const variable_list = javascriptGenerator.nameDB_.getName(block.getFieldValue('list'), 'VARIABLE')
  const variable_list = javascriptGenerator.valueToCode(block, 'LIST', javascriptGenerator.ORDER_ATOMIC)

  // const variable_name = javascriptGenerator.nameDB_.getName(block.getFieldValue('NAME'), 'VARIABLE')
  const variable_name = javascriptGenerator.valueToCode(block, 'NAME', javascriptGenerator.ORDER_ATOMIC)
  // TODO: Assemble JavaScript into code variable.
  const code = `${variable_list}.push(${variable_name});\n`
  // TODO: Change ORDER_NONE to the correct strength.
  return code
}
