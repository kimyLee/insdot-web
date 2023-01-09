
import { defineBlocksWithJsonArray } from 'blockly/core'

import '../block-js-code/loop'

defineBlocksWithJsonArray([
  // Block for 'for' loop.
  {
    type: 'custom_controls_for',
    message0: '%{BKY_CONTROLS_FOR_TITLE}',
    args0: [
      {
        type: 'field_variable',
        name: 'VAR',
        variable: null,
        variableTypes: ['VAR'],
        defaultType: 'VAR',
      },
      {
        type: 'input_value',
        name: 'FROM',
        check: 'Number',
        align: 'RIGHT',
      },
      {
        type: 'input_value',
        name: 'TO',
        check: 'Number',
        align: 'RIGHT',
      },
      {
        type: 'input_value',
        name: 'BY',
        check: 'Number',
        align: 'RIGHT',
      },
    ],
    message1: '%{BKY_CONTROLS_REPEAT_INPUT_DO} %1',
    args1: [{
      type: 'input_statement',
      name: 'DO',
    }],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    style: 'loop_blocks',
    helpUrl: '%{BKY_CONTROLS_FOR_HELPURL}',
    extensions: [
      // 'contextMenu_newGetVariableBlock',
      'controls_for_tooltip',
    ],
  },
  // Block for 'for each' loop.
  {
    type: 'custom_controls_forEach',
    message0: '%{BKY_CONTROLS_FOREACH_TITLE}',
    args0: [
      {
        type: 'field_variable',
        name: 'VAR',
        variable: null,
        variableTypes: ['VAR'],
        defaultType: 'VAR',
      },
      {
        type: 'input_value',
        name: 'LIST',
        check: 'Array',
      },
    ],
    message1: '%{BKY_CONTROLS_REPEAT_INPUT_DO} %1',
    args1: [{
      type: 'input_statement',
      name: 'DO',
    }],
    previousStatement: null,
    nextStatement: null,
    style: 'loop_blocks',
    helpUrl: '%{BKY_CONTROLS_FOREACH_HELPURL}',
    extensions: [
      // 'contextMenu_newGetVariableBlock',
      'controls_forEach_tooltip',
    ],
  },
])
