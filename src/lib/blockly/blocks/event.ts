
import Blockly from 'blockly'
import '../block-js-code/event'
import { customKey } from '@/lib/blockly/i18n/zh'

Blockly.defineBlocksWithJsonArray([
  {
    type: 'setUp',
    message0: customKey.TOOL_SETUP,
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
    message0: customKey.TOOL_WAIT,
    args0: [
      {
        type: 'input_value',
        name: 'NAME',
        // value: 1,
        // min: 0,
        // max: 100,
        // precision: 0,
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
    message0: customKey.TOOL_PRINT,
    args0: [
      {
        type: 'field_variable',
        name: 'NAME',
        variable: 'value',
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
    message0: customKey.TOOL_PRINT_ANY,
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
  // {
  //   type: 'consolelog',
  //   // message0: 'print value of  %1',
  //   message0: 'print %1 的值',
  //   args0: [
  //     {
  //       type: 'field_variable',
  //       name: 'NAME',
  //       variable: 'item',
  //     },
  //   ],
  //   previousStatement: null,
  //   nextStatement: null,
  //   colour: 230,
  //   tooltip: '',
  //   helpUrl: '',
  // },
  {
    type: 'date_now',
    message0: customKey.TOOL_CURRENT_TIME,
    output: 'Number',
    colour: 230,
    tooltip: '',
    helpUrl: '',
  },
])
