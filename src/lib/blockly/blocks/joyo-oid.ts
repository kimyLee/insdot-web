
// // todo: blockly 类型
import Blockly from 'blockly'
import '../block-js-code/joyo-oid'
import colorOption from './option-img/color-option'
import { customKey } from '@/lib/blockly/i18n/zh'

Blockly.defineBlocksWithJsonArray([
  {
    type: 'receive_letter',
    message0: customKey.IDENTIFY_LETTER,
    args0: [
      {
        type: 'field_dropdown',
        name: 'NAME',
        options: [...Array(26)].map((ele, index) => {
          return [
            String.fromCharCode((65 + index)),
            (2101 + index).toString(),
          ]
        }),
      },
    ],
    output: 'Number',
    colour: 230,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'receive_number',
    message0: customKey.IDENTIFY_NUMBER,
    args0: [
      {
        type: 'field_dropdown',
        name: 'NAME',
        options: [...Array(10)].map((ele, index) => {
          return [
            index.toString(),
            (2200 + index).toString(),
          ]
        }),
      },
    ],
    output: 'Number',
    colour: 230,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'receive_card',
    message0: customKey.IDENTIFY_EMPTY_CARD,
    args0: [
      {
        type: 'field_dropdown',
        name: 'NAME',
        options: [...Array(40)].map((ele, index) => {
          return [
            (index + 1).toString(),
            (2231 + index).toString(),
          ]
        }),
      },
    ],
    output: 'Number',
    colour: 230,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'receive_card_num',
    message0: customKey.IDENTIFY_EMPTY_CARD,
    args0: [
      {
        type: 'input_value',
        name: 'NAME',
      },
    ],
    output: 'Number',
    colour: 230,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'receive_sticker',
    message0: customKey.IDENTIFY_STICKER,
    args0: [
      {
        type: 'input_value',
        name: 'NAME',
      },
    ],
    output: 'Number',
    colour: 230,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'receive_symbol',
    message0: customKey.IDENTIFY_SYMBOL,
    args0: [
      {
        type: 'field_dropdown',
        name: 'NAME',
        options: [
          [
            '+',
            '2214',
          ],
          [
            '-',
            '2215',
          ],
          [
            '×',
            '2211',
          ],
          [
            '÷',
            '2212',
          ],
          [
            '=',
            '2213',
          ],
        ],
      },
    ],
    output: 'Number',
    colour: 230,
    tooltip: '',
    helpUrl: '',
  },
  // 识别到颜色
  {
    type: 'receive_color',
    message0: customKey.IDENTIFY_COLOR_CARD,
    args0: [
      {
        type: 'field_dropdown',
        name: 'NAME',
        options: colorOption.map((ele, index) => {
          return [
            {
              src: ele.base64,
              width: 30,
              height: 30,
              alt: ele.alt,
            },
            ele.code.toString(),
          ]
        }),
      },
    ],
    output: 'Number',
    colour: 230,
    tooltip: '',
    helpUrl: '',
  },
  // 识别到任意ID
  {
    type: 'receive_ID',
    message0: customKey.IDENTIFY_ID,
    args0: [
      {
        type: 'input_value',
        name: 'NAME',
      },
      // {
      //   type: 'field_dropdown',
      //   name: 'NAME',
      //   options: [...Array(40)].map((ele, index) => {
      //     return [
      //       (index + 1).toString(),
      //       (2231 + index).toString(),
      //     ]
      //   }),
      // },
    ],
    output: 'Number',
    colour: 230,
    tooltip: '',
    helpUrl: '',
  },
])
