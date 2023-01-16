
import { defineBlocksWithJsonArray } from 'blockly/core'
import '../block-js-code/list'
import { customKey } from '@/lib/blockly/i18n/zh'

defineBlocksWithJsonArray([
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
    output: 'Array',
    style: 'list_blocks',
    // helpUrl: '%{BKY_VARIABLES_GET_HELPURL}',
    // tooltip: '%{BKY_VARIABLES_GET_TOOLTIP}',
    // extensions: ['contextMenu_variableSetterGetter'],
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
        check: 'Array', // Checks that the input value is of type "Panda"
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'list_blocks',
    // helpUrl: '%{BKY_VARIABLES_GET_HELPURL}',
    // tooltip: '%{BKY_VARIABLES_GET_TOOLTIP}',
    // extensions: ['contextMenu_variableSetterGetter'],
  },
  {
    type: 'list_include',
    // message0: 'list %1 including item %2',
    message0: customKey.LIST_INCLUDE,
    args0: [
      {
        type: 'input_value',
        name: 'LIST',
      },
      {
        type: 'input_value',
        name: 'NAME',
      },
    ],
    output: 'Boolean',
    colour: 230,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'list_push',
    // message0: 'list %1 including item %2',
    message0: customKey.LIST_PUSH,
    args0: [
      {
        type: 'input_value',
        name: 'LIST',
      },
      {
        type: 'input_value',
        name: 'NAME',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: '',
    helpUrl: '',
  },

])
