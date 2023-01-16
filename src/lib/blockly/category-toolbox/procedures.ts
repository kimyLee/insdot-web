import { customKey } from '@/lib/blockly/i18n/zh'

export default {
  kind: 'category',
  name: customKey.TOOLBOX_FUNC,
  custom: 'PROCEDURE',
  cssConfig: {
    container: 'category-func',
  },
  contents: [
    {
      kind: 'block',
      type: 'procedures_defnoreturn',
    },
    // {
    //   kind: 'block',
    //   type: 'procedures_defreturn',
    // },
    // {
    //   kind: 'block',
    //   type: 'procedures_mutatorcontainer',
    // },
    // {
    //   kind: 'block',
    //   type: 'procedures_callnoreturn',
    // },
    // {
    //   kind: 'block',
    //   type: 'procedures_callreturn',
    // },
    // {
    //   kind: 'block',
    //   type: 'procedures_ifreturn',
    // },
  ],
}
