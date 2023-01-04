
// // todo: blockly 类型
import Blockly from 'blockly'

Blockly.JavaScript.set_light = function (block: any) {
  const variable_light = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('light'), 'VARIABLE')

  return 'bleSetLight(JSON.stringify({colors:' + variable_light + ',bright:1}));\n'
  // return 'bleSetLight(JSON.stringify({colors:' + variable_light + '.map(function (e) {' +
  //   "if (typeof (e) === 'string') {" +
  //   "e = e.replace('#', '')" +
  //   '}' +
  //   'return Number(e);' +
  //   '}),bright:1}));\n'
}

Blockly.JavaScript.set_all_light = function (block: any) {
  const number_color = block.getFieldValue('color')
  console.log(number_color)
  const arr = JSON.parse(JSON.stringify(Array(12).fill(Number(number_color))))

  return 'bleSetLight(JSON.stringify({colors:[' + arr + '],bright:1}));\n'
}

Blockly.JavaScript.lists_create_with_row = function (block: any) {
  // Create a list with any number of elements of any type.
  const elements = new Array(block.itemCount_)
  for (let i = 0; i < block.itemCount_; i++) {
    elements[i] =
      Blockly.JavaScript.valueToCode(block, 'ADD' + i, Blockly.JavaScript.ORDER_NONE) ||
      'null'
  }
  const code = '[' + elements.join(', ') + ']'
  return [code, Blockly.JavaScript.ORDER_ATOMIC]
}

Blockly.JavaScript.list_include = function (block: any) {
  // const variable_list = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('list'), 'VARIABLE')
  const variable_list = Blockly.JavaScript.valueToCode(block, 'LIST', Blockly.JavaScript.ORDER_ATOMIC)

  // const variable_name = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('NAME'), 'VARIABLE')
  const variable_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC)
  // TODO: Assemble JavaScript into code variable.
  const code = `${variable_list}.indexOf(${variable_name}) >= 0`
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE]
}

Blockly.JavaScript.set_all_light_color = function (block: any) {
  const number_r = block.getFieldValue('R')
  const number_g = block.getFieldValue('G')
  const number_b = block.getFieldValue('B')

  const arr = JSON.parse(JSON.stringify(Array(12).fill(number_r * 256 * 256 + number_g * 256 + number_b)))

  return 'bleSetLight(JSON.stringify({colors:[' + arr + '],bright:1}));\n'
}

Blockly.JavaScript.set_light_animation = function (block: any) {
  const dropdown_animation = block.getFieldValue('animation')
  const number_name = block.getFieldValue('NAME')
  const text_color = block.getFieldValue('color')
  // TODO: Assemble JavaScript into code variable.
  return `bleSetLightAnimation('${dropdown_animation}', ${number_name}, ${text_color});\n`
}
Blockly.JavaScript.clear_light = function (block: any) {
  return 'clearAllLight();\n'
}
