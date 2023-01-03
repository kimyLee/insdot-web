import { defineBlocksWithJsonArray } from 'blockly/core'

import { javascriptGenerator } from 'blockly/javascript'

defineBlocksWithJsonArray([
  // Block for variable getter.

  {
    type: 'variables_get_list',
    message0: '%1',
    args0: [{
      type: 'field_variable',
      name: 'VAR',
      // variable: '%{BKY_VARIABLES_DEFAULT_NAME}',
      variable: '?',
      variableTypes: ['LIST'],
      defaultType: 'LIST',
    }],
    output: null,
    style: 'list_blocks',
    helpUrl: '%{BKY_VARIABLES_GET_HELPURL}',
    tooltip: '%{BKY_VARIABLES_GET_TOOLTIP}',
    // extensions: ['contextMenu_variableSetterGetter'],
  },
  // Block for variable setter.
  {
    type: 'variables_set_list',
    message0: '%{BKY_VARIABLES_SET}',
    args0: [
      {
        type: 'field_variable',
        name: 'VAR',
        variable: '?',
        // variable: '%{BKY_VARIABLES_DEFAULT_NAME}',
        variableTypes: ['LIST'],
        defaultType: 'LIST',
      },
      {
        type: 'input_value',
        name: 'VALUE',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'list_blocks',
    helpUrl: '%{BKY_VARIABLES_GET_HELPURL}',
    tooltip: '%{BKY_VARIABLES_GET_TOOLTIP}',
    // extensions: ['contextMenu_variableSetterGetter'],
  },
])

javascriptGenerator.variables_get_list = javascriptGenerator.variables_get

javascriptGenerator.variables_set_list = javascriptGenerator.variables_set
