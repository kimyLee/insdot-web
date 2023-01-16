import { customKey } from '@/lib/blockly/i18n/zh'

export default {
  kind: 'category',
  name: customKey.TOOLBOX_LIGHT,
  cssConfig: {
    container: 'category-joyo',
  },
  contents: [
    {
      kind: 'block',
      type: 'set_light_by_ui',
    },
    {
      kind: 'block',
      type: 'set_light',
    },
    {
      kind: 'block',
      type: 'set_all_light',
      inputs: {
        color: {
          block: {
            type: 'text',
            fields: {
              TEXT: '0xffffff',
            },
          },
        },
      },
    },
    {
      kind: 'block',
      type: 'set_all_light_color',
      inputs: {
        R: {
          shadow: {
            type: 'math_number',
            fields: {
              NUM: 255,
            },
          },
        },
        G: {
          shadow: {
            type: 'math_number',
            fields: {
              NUM: 255,
            },
          },
        },
        B: {
          shadow: {
            type: 'math_number',
            fields: {
              NUM: 255,
            },
          },
        },
      },
    },
    {
      kind: 'block',
      type: 'set_light_animation',
      inputs: {
        time: {
          shadow: {
            type: 'math_number',
            fields: {
              NUM: 5,
            },
          },
        },
        color: {
          block: {
            type: 'text',
            fields: {
              TEXT: '0xffffff',
            },
          },
        },
      },
    },
    {
      kind: 'block',
      type: 'clear_light',
    },
  ],
}
