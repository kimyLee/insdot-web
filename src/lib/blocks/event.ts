
import { defineBlocksWithJsonArray } from 'blockly/core'
import { javascriptGenerator } from 'blockly/javascript'

defineBlocksWithJsonArray([
  {
    type: 'setUp',
    // message0: 'setup %1 %2',
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
    // message0: 'wait %1 second',
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
    // message0: 'print value of  %1',
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

javascriptGenerator.setUp = function (block: any) {
  const branchCode = javascriptGenerator.statementToCode(block, 'main')
  // return branchCode
  return 'function setUp() {\n' + branchCode + '}\nsetUp();\n'
}

javascriptGenerator.wait_second = function (block: any) {
  const number_name = block.getFieldValue('NAME')
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

// javascriptGenerator['date_now'] = function (block) {
//   // TODO: Assemble JavaScript into code variable.
//   var code = '...;\n';
//   return code
// }

// Blockly.defineBlocksWithJsonArray([
//   {
//     type: 'oidChange',
//     message0: 'oid值变化时 %1 %2',
//     args0: [
//       {
//         type: 'input_dummy',
//       },
//       {
//         type: 'input_statement',
//         name: 'main',
//       },
//     ],
//     colour: 180,
//     tooltip: '',
//     helpUrl: '',
//   },
// ])

// javascriptGenerator.oidChange = function (block: any) {
//   // const branchCode = javascriptGenerator.statementToCode(block, 'main')
//   const pElement = javascriptGenerator.variableDB_.getName(block.getFieldValue('pElement'), Blockly.Variables.NAME_TYPE)
//   const statements = javascriptGenerator.statementToCode(block, 'INSERTED')
//   // TODO: Assemble JavaScript into code variable.
//   const code = 'insert_function = function(pElement) {\n' + statements + ';\n};'
//   return code
// }
