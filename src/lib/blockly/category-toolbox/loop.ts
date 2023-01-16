import { customKey } from '@/lib/blockly/i18n/zh'

export default {
  kind: 'category',
  name: customKey.TOOLBOX_LOOP,
  cssConfig: {
    container: 'category-loop',
  },
  contents: [
    {
      kind: 'block',
      type: 'controls_repeat_ext',
      inputs: {
        TIMES: {
          shadow: {
            type: 'math_number',
            fields: {
              NUM: 5,
            },
          },
        },
      },
    },
    // {
    //   kind: 'block',
    //   type: 'controls_repeat',
    // },
    {
      kind: 'block',
      type: 'controls_whileUntil',
    },
    {
      kind: 'block',
      type: 'custom_controls_for',
    },
    {
      kind: 'block',
      type: 'custom_controls_forEach',
    },
    {
      kind: 'block',
      type: 'controls_flow_statements',
    },

  ],
}
