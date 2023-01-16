
import { customKey } from '@/lib/blockly/i18n/zh'

export default {
  kind: 'category',
  name: customKey.TOOLBOX_IDENTIFY,
  cssConfig: {
    container: 'category-joyo',
  },
  contents: [
    {
      kind: 'block',
      type: 'receive_letter',
    },
    {
      kind: 'block',
      type: 'receive_number',
    },
    {
      kind: 'block',
      type: 'receive_symbol',
    },
    {
      kind: 'block',
      type: 'receive_card',
    },
    {
      kind: 'block',
      type: 'receive_card_num',
      inputs: {
        NAME: {
          shadow: {
            type: 'math_number',
            fields: {
              NUM: 1,
            },
          },
        },
      },
    },
    {
      kind: 'block',
      type: 'receive_sticker',
      inputs: {
        NAME: {
          shadow: {
            type: 'math_number',
            fields: {
              NUM: 1,
            },
          },
        },
      },
    },
    {
      kind: 'block',
      type: 'receive_color',
    },
    {
      kind: 'block',
      type: 'receive_ID',
      inputs: {
        NAME: {
          shadow: {
            type: 'math_number',
            fields: {
              NUM: 1801, // 1-128
            },
          },
        },
      },
    },

  ],
}
