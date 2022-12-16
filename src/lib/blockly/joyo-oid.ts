export default {
  kind: 'category',
  name: '识别',
  cssConfig: {
    container: 'category-joyo',
  },
  contents: [
    {
      kind: 'block',
      type: 'setUp',
    },
    {
      kind: 'block',
      type: 'consolelog',
    },
    {
      kind: 'block',
      type: 'printany',
    },
    {
      kind: 'block',
      type: 'wait_second',
    },
    {
      kind: 'block',
      type: 'date_now',
    },
  ],
}
