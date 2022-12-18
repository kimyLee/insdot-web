
export default {
  kind: 'category',
  name: '识别',
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
      type: 'receive_color',
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
    {
      kind: 'block',
      type: 'setUp',
    },
  ],
}
