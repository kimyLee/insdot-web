export default {
  kind: 'category',
  name: '变量',
  custom: 'VARIABLE',
  cssConfig: {
    container: 'category-var',
  },
  contents: [
    {
      kind: 'block',
      type: 'variables_set',
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
  ],
}
