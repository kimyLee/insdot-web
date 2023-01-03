export default {
  kind: 'category',
  name: '列表',
  cssConfig: {
    container: 'category-list',
  },
  // custom: 'LIST',
  contents: [
    // {
    //   kind: 'label',
    //   text: '列表',
    //   // 'web-class': 'myLabelStyle', //  样式覆盖css
    // },
    // {
    //   kind: 'block',
    //   type: 'variables_set_list',
    // },

    // {
    //   kind: 'block',
    //   type: 'variables_get_list',
    // },
    {
      kind: 'block',
      type: 'lists_create_empty',
    },
    {
      kind: 'block',
      type: 'lists_repeat',
    },
    {
      kind: 'block',
      type: 'lists_reverse',
    },
    {
      kind: 'block',
      type: 'lists_isEmpty',
    },
    {
      kind: 'block',
      type: 'lists_length',
    },
    {
      kind: 'block',
      type: 'lists_indexOf',
    },
    {
      kind: 'block',
      type: 'lists_create_with',
    },
    {
      kind: 'block',
      type: 'lists_create_with_row',
    },
    {
      kind: 'block',
      type: 'lists_create_with_container',
    },
    {
      kind: 'block',
      type: 'lists_create_with_item',
    },
    {
      kind: 'block',
      type: 'lists_indexOf',
    },
    // {
    //   kind: 'block',
    //   type: 'list_include',
    // },
    {
      kind: 'block',
      type: 'lists_getIndex',
    },
    {
      kind: 'block',
      type: 'lists_setIndex',
    },
    {
      kind: 'block',
      type: 'lists_getSublist',
    },
    {
      kind: 'block',
      type: 'lists_sort',
    },
    {
      kind: 'block',
      type: 'lists_split',
    },
  ],
}
