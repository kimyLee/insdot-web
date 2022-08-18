
import Blockly from 'blockly'

Blockly.defineBlocksWithJsonArray([
  {
    type: 'setUp',
    // message0: 'setup %1 %2',
    message0: '程序开始时 %1 %2',
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
    message0: '等待 %1 秒',
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
    message0: '输出 %1 的值',
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
    message0: '显示 %1',
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
    message0: '输出 %1 的值',
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
    message0: '当前时间（毫秒）',
    output: 'Number',
    colour: 230,
    tooltip: '',
    helpUrl: '',
  },
])

Blockly.JavaScript.setUp = function (block: any) {
  const branchCode = Blockly.JavaScript.statementToCode(block, 'main')
  // return branchCode
  return 'function setUp() {\n' + branchCode + '}\nsetUp();\n'
}

Blockly.JavaScript.wait_second = function (block: any) {
  const number_name = block.getFieldValue('NAME')
  return 'sleepFn(' + number_name + ');\n'
}
Blockly.JavaScript.consolelog = function (block: any) {
  // const number_name = block.getFieldValue('NAME')
  const variable_name = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('NAME'), 'VARIABLE')
  return 'print("' + variable_name + '", JSON.stringify(' + variable_name + '));\n'
}
Blockly.JavaScript.printany = function (block: any) {
  // const number_name = block.getFieldValue('NAME')
  const value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC)
  // TODO: Assemble JavaScript into code variable.
  console.log(value_name)
  const code = 'print(' + value_name + ');\n'
  return code
}
Blockly.JavaScript.date_now = function (block: any) {
  return ['getDateNow()', Blockly.JavaScript.ORDER_NONE]
}

// Blockly.JavaScript['date_now'] = function (block) {
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

// Blockly.JavaScript.oidChange = function (block: any) {
//   // const branchCode = Blockly.JavaScript.statementToCode(block, 'main')
//   const pElement = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('pElement'), Blockly.Variables.NAME_TYPE)
//   const statements = Blockly.JavaScript.statementToCode(block, 'INSERTED')
//   // TODO: Assemble JavaScript into code variable.
//   const code = 'insert_function = function(pElement) {\n' + statements + ';\n};'
//   return code
// }
