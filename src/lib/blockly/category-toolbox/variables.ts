import { customKey } from '@/lib/blockly/i18n/zh'

export default {
  kind: 'category',
  name: customKey.TOOLBOX_VAR,
  // custom: 'VAR',
  cssConfig: {
    container: 'category-var',
  },
  contents: [
    {
      kind: 'block',
      type: 'variables_get_var',
      fields: {
        VAR: {
          type: 'VAR',
          name: 'value_1',
        },
      },
    },
    {
      kind: 'block',
      type: 'variables_set_var',
      fields: {
        VAR: {
          type: 'VAR',
          name: 'value_1',
        },
      },
      inputs: {
        VALUE: {
          block: {
            type: 'math_number',
            fields: {
              NUM: 0,
            },
          },
        },
      },
    },

    {
      kind: 'block',
      type: 'custom_math_change',
      fields: {
        VAR: {
          type: 'VAR',
          name: 'value_1',
        },
      },
      inputs: {
        DELTA: {
          block: {
            type: 'math_number',
            fields: {
              NUM: 1,
            },
          },
        },
      },
    },
  ],
}
