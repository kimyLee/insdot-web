import { defineBlocksWithJsonArray } from 'blockly/core'

import '../block-js-code/variable'

defineBlocksWithJsonArray([
  // Block for variable getter.

  {
    type: 'variables_get_var',
    message0: '%1',
    args0: [{
      type: 'field_variable',
      name: 'VAR',
      variable: '%{BKY_VARIABLES_DEFAULT_NAME}',
      variableTypes: ['VAR'],
      defaultType: 'VAR',
    }],
    output: null,
    style: 'variable_blocks',
    // helpUrl: '%{BKY_VARIABLES_GET_HELPURL}',
    // tooltip: '%{BKY_VARIABLES_GET_TOOLTIP}',
    // extensions: ['contextMenu_variableSetterGetter'],
  },

  // Block for adding to a variable in place.
  {
    type: 'custom_math_change',
    message0: '%{BKY_MATH_CHANGE_TITLE}',
    args0: [
      {
        type: 'field_variable',
        name: 'VAR',
        variable: '%{BKY_MATH_CHANGE_TITLE_ITEM}',
        variableTypes: ['VAR'],
        defaultType: 'VAR',
      },
      {
        type: 'input_value',
        name: 'DELTA',
        check: 'Number',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'variable_blocks',
    // helpUrl: '%{BKY_MATH_CHANGE_HELPURL}',
    extensions: ['math_change_tooltip'],
  },

  // Block for variable setter.
  {
    type: 'variables_set_var',
    message0: '%{BKY_VARIABLES_SET}',
    args0: [
      {
        type: 'field_variable',
        name: 'VAR',
        variable: '%{BKY_VARIABLES_DEFAULT_NAME}',
        variableTypes: ['VAR'],
        defaultType: 'VAR',
      },
      {
        type: 'input_value',
        name: 'VALUE',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'variable_blocks',
    // helpUrl: '%{BKY_VARIABLES_GET_HELPURL}',
    // tooltip: '%{BKY_VARIABLES_GET_TOOLTIP}',
    // extensions: ['contextMenu_variableSetterGetter'],

  },
])
