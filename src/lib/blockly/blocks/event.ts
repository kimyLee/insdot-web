
import Blockly from 'blockly'
import '../block-js-code/event'

Blockly.defineBlocksWithJsonArray([
  {
    type: 'setUp',
    message0: 'start game %1 %2',
    args0: [
      {
        type: 'input_dummy',
      },
      {
        type: 'input_statement',
        name: 'main',
      },
    ],
    colour: 180,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'wait_second',
    message0: 'wait %1 second',
    args0: [
      {
        type: 'field_number',
        name: 'NAME',
        value: 1,
        min: 0,
        max: 100,
        precision: 0,
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'consolelog',
    message0: 'print %1 ',
    args0: [
      {
        type: 'field_variable',
        name: 'NAME',
        variable: 'item',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'printany',
    message0: 'print %1',
    args0: [
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
  {
    type: 'consolelog',
    // message0: 'print value of  %1',
    message0: 'print %1 的值',
    args0: [
      {
        type: 'field_variable',
        name: 'NAME',
        variable: 'item',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'date_now',
    message0: 'current time（毫秒）',
    output: 'Number',
    colour: 230,
    tooltip: '',
    helpUrl: '',
  },
])
