
import Blockly from 'blockly'
import '../block-js-code/list'

Blockly.defineBlocksWithJsonArray([
  // Block for Panda variable getter.
  {
    type: 'variables_get_list',
    message0: '%1',
    args0: [
      {
        type: 'field_variable',
        name: 'VAR',
        variable: '%{BKY_VARIABLES_DEFAULT_NAME}',
        variableTypes: ['LIST'], // Specifies what types to put in the dropdown
        defaultType: 'LIST',
      },
    ],
    output: 'LIST', // Returns a value of "Panda"
  },

  // Block for Panda variable setter.
  {
    type: 'variables_set_list',
    message0: '%{BKY_VARIABLES_SET}',
    args0: [
      {
        type: 'field_variable',
        name: 'VAR',
        variable: '%{BKY_VARIABLES_DEFAULT_NAME}',
        variableTypes: ['LIST'],
        defaultType: 'LIST',
      },
      {
        type: 'input_value',
        name: 'VALUE',
        check: 'LIST', // Checks that the input value is of type "Panda"
      },
    ],
    previousStatement: null,
    nextStatement: null,
  },
])
