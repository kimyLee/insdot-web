
import CONSTANT from './constant'
import { customKey } from '@/lib/blockly/i18n/zh'

export function registerToolboxCategoryCallback (myWorkspace: any) {
  myWorkspace.registerButtonCallback('myFirstButtonPressed', () => {
    // dosomething
  })
  // Associates the function with the string '···'
  // myWorkspace.registerToolboxCategoryCallback(
  //   'list_var', listVarFlyoutCallback)
}

export default {
  kind: 'category',
  name: customKey.TOOLBOX_LIST,
  cssConfig: {
    container: 'category-list',
  },
  contents: [
    // {
    //   kind: 'button',
    //   text: '创建列表',
    //   callbackKey: 'CREATE_TYPED_VARIABLE_VAR',
    // },
    {
      kind: 'block',
      type: 'variables_get_list',
      fields: {
        VAR: {
          type: 'LIST',
          name: 'list_1',
        },
      },
    },
    {
      kind: 'block',
      type: 'variables_set_list',
      fields: {
        VAR: {
          type: 'LIST',
          name: 'list_1',
        },
      },
    },
    {
      kind: 'block',
      type: 'lists_create_empty',
    },
    {
      kind: 'block',
      type: 'lists_create_with', //  lists_create_with_row
      inputs: {
        ADD0: {
          block: {
            type: 'math_number',
            id: 'Rf7_0x9O?,U4xs4g:P.2',
            fields: {
              NUM: 0,
            },
          },
        },
        ADD1: {
          block: {
            type: 'math_number',
            id: 'h.CMI#o%3XqY1#QWPzay',
            fields: {
              NUM: 1,
            },
          },
        },
        ADD2: {
          block: {
            type: 'math_number',
            id: '%1^c%D7r).a@vKC#LLLU',
            fields: {
              NUM: 2,
            },
          },
        },
      },
    },
    {
      kind: 'block',
      type: 'lists_repeat',
      inputs: {
        ITEM: {
          //  这里是可以接收多种变量和官网保持一致，不设置默认值这里。
          // block: {
          //   type: 'variables_get_list',
          //   fields: {
          //     VAR: {
          //       type: 'LIST',
          //       name: 'list_1',
          //     },
          //   },
          // },
        },
        NUM: {
          shadow: {
            type: 'math_number',
            fields: {
              NUM: 5,
            },
          },
        },
      },
    },
    {
      kind: 'block',
      type: 'lists_length',
      inputs: {
        VALUE: {
          block: {
            type: 'variables_get_list',
            fields: {
              VAR: {
                type: 'LIST',
                name: 'list_1',
              },
            },
          },
        },
      },
    },

    {
      kind: 'block',
      type: 'lists_isEmpty',
      inputs: {
        VALUE: {
          block: {
            type: 'variables_get_list',
            fields: {
              VAR: {
                type: 'LIST',
                name: 'list_1',
              },
            },
          },
        },
      },
    },
    {
      kind: 'block',
      type: 'lists_indexOf',
      inputs: {
        VALUE: {
          block: {
            type: 'variables_get_list',
            fields: {
              VAR: {
                type: 'LIST',
                name: 'list_1',
              },
            },
          },
        },
        FIND: {
          block: {
            type: 'math_number',
            fields: {
              NUM: 0,
            },
          },
        },
      },
    },

    // {
    //   kind: 'block',
    //   type: 'lists_create_with_container',
    // },
    // {
    //   kind: 'block',
    //   type: 'lists_create_with_item',
    // },
    {
      kind: 'block',
      type: 'list_include',
      inputs: { // 选项为value的name，input有三种，value，state,dummy
        LIST: {
          block: {
            type: 'variables_get_list',
            fields: {
              VAR: {
                type: 'LIST',
                name: 'list_1',
              },
            },
          },
        },
        NAME: {
          shadow: {
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
      type: 'lists_getIndex',
      inputs: {
        VALUE: {
          block: {
            type: 'variables_get_list',
            fields: {
              VAR: {
                type: 'LIST',
                name: 'list_1',
              },
            },
          },
        },
        AT: {
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
      type: 'list_push',
      inputs: { // 选项为value的name，input有三种，value，state,dummy
        LIST: {
          block: {
            type: 'variables_get_list',
            fields: {
              VAR: {
                type: 'LIST',
                name: 'list_1',
              },
            },
          },
        },
        NAME: {
          shadow: {
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
      type: 'lists_setIndex',
      inputs: {
        LIST: {
          block: {
            type: 'variables_get_list',
            fields: {
              VAR: {
                type: 'LIST',
                name: 'list_1',
              },
            },
          },
        },
        AT: {
          block: {
            type: 'math_number',
            fields: {
              NUM: 1,
            },
          },
        },
        TO: {
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
      type: 'lists_getSublist',
      inputs: {
        LIST: {
          block: {
            type: 'variables_get_list',
            fields: {
              VAR: {
                type: 'LIST',
                name: 'list_1',
              },
            },
          },
        },
        AT1: {
          block: {
            type: 'math_number',
            fields: {
              NUM: 1,
            },
          },
        },
        AT2: {
          block: {
            type: 'math_number',

            fields: {
              NUM: 2,
            },
          },
        },
      },
    },

    {
      kind: 'block',
      type: 'lists_split',
      inputs: {
        INPUT: {
          shadow: {
            type: 'text',
            fields: {
              TEXT: '1,2,3',
            },
          },
        },
        DELIM: {
          shadow: {
            type: 'text',
            fields: {
              TEXT: ',',
            },
          },
        },
      },
    },

    {
      kind: 'block',
      type: 'lists_sort',
      inputs: {
        LIST: {
          block: {
            type: 'variables_get_list',
            fields: {
              VAR: {
                type: 'LIST',
                name: 'list_1',
              },
            },
          },
        },
      },

    },

    {
      kind: 'block',
      type: 'lists_reverse',
    },
  ],
}
