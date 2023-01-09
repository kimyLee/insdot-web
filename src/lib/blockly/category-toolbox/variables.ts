export default {
  kind: 'category',
  name: '变量',
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
          name: 'var',
        },
      },
    },
    {
      kind: 'block',
      type: 'variables_set_var',
      fields: {
        VAR: {
          type: 'VAR',
          name: 'var',
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
          name: 'var',
        },
      },
      inputs: {
        DELTA: {
          block: {
            type: 'math_number',
            fields: {
              NUM: 0,
            },
          },
        },
      },
    },
  ],
}
