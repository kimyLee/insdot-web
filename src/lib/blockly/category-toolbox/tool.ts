
import { customKey } from '@/lib/blockly/i18n/zh'

export default {
  kind: 'category',
  name: customKey.TOOLBOX_TOOL,
  cssConfig: {
    container: 'category-joyo',
  },
  contents: [
    {
      kind: 'block',
      type: 'consolelog',
    },
    {
      kind: 'block',
      type: 'printany',
      inputs: {
        NAME: {
          shadow: {
            type: 'text',
            fields: {
              TEXT: 'hello world',
            },
          },
        },
      },
    },
    {
      kind: 'block',
      type: 'wait_second',
      inputs: {
        NAME: {
          block: {
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
      type: 'date_now',
    },
    {
      kind: 'block',
      type: 'setUp',
    },
  ],
}
