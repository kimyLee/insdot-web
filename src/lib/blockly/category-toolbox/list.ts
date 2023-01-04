
import CONSTANT from './constant'

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
  name: '列表',
  cssConfig: {
    container: 'category-list',
  },
  contents: [
    // {
    //   kind: 'button',
    //   text: '创建列表',
    //   callbackKey: 'myFirstButtonPressed',
    // },
    // {
    //   kind: 'block',
    //   type: 'variables_get_list',
    // },
    // {
    //   kind: 'block',
    //   type: 'variables_set_list',
    // },
    {
      kind: 'block',
      type: 'lists_create_empty',
    },
    {
      kind: 'block',
      type: 'lists_repeat',
      inputs: {
        ITEM: {
          block: {
            type: 'variables_get',
            fields: {
              VAR: {
                id: CONSTANT.VALUE_ID,
              },
            },
          },
        },
        NUM: {
          shadow: {
            type: 'math_number',
            id: '9.]Jp#k.8s[aKPYijF;]',
            fields: {
              NUM: 5,
            },
          },
        },
      },
    },
    // {
    //   kind: 'block',
    //   type: 'lists_reverse',
    // },
    {
      kind: 'block',
      type: 'lists_isEmpty',
      inputs: {
        VALUE: {
          block: {
            type: 'variables_get',
            fields: {
              VAR: {
                id: CONSTANT.VALUE_ID,
              },
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
            type: 'variables_get',
            fields: {
              VAR: {
                id: CONSTANT.VALUE_ID,
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
            type: 'variables_get',
            id: '9i1G1eGoI+*4ScMgQovO',
            fields: {
              VAR: {
                id: CONSTANT.VALUE_ID,
              },
            },
          },
        },
        FIND: {
          block: {
            type: 'math_number',
            id: 'a!5?N489v-`YBytz.eob',
            fields: {
              NUM: 0,
            },
          },
        },
      },
    },
    {
      kind: 'block',
      type: 'lists_create_with',
    },
    {
      kind: 'block',
      type: 'lists_create_with_row',
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
      type: 'lists_indexOf',
      inputs: {
        VALUE: {
          block: {
            type: 'variables_get',
            id: 'ghKm`qu(0]P#V,Rdvv^g',
            fields: {
              VAR: {
                id: CONSTANT.VALUE_ID,
              },
            },
          },
        },
        FIND: {
          block: {
            type: 'math_number',
            id: '(4_9pi%_Xp3ZEeZJsX{6',
            fields: {
              NUM: 0,
            },
          },
        },
      },
    },
    {
      kind: 'block',
      type: 'list_include',
      inputs: { // 选项为value的name，input有三种，value，state,dummy
        LIST: {
          block: {
            type: 'variables_get',
            id: 'ghKm`qu(0]P#V,Rdvv^g',
            fields: {
              VAR: {
                id: CONSTANT.VALUE_ID,
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
            type: 'variables_get',
            id: 'H[NW}bTP@uI=u;6O#F#S',
            fields: {
              VAR: {
                id: CONSTANT.VALUE_ID,
              },
            },
          },
        },
        AT: {
          block: {
            type: 'math_number',
            id: 'AE9rbFXsF%trf%--S_+M',
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
            type: 'variables_get',
            id: 'v2CG~GX5Y3?vXcS%,aab',
            fields: {
              VAR: {
                id: CONSTANT.VALUE_ID,
              },
            },
          },
        },
        AT: {
          block: {
            type: 'math_number',
            id: 'J4f@t%g=v0:8C4`R]8#+',
            fields: {
              NUM: 1,
            },
          },
        },
        TO: {
          block: {
            type: 'math_number',
            id: ',yHZTFB)BgID(,H[d.%V',
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
            type: 'variables_get',
            id: '!-Cjl=/2EY?no?_UmVPI',
            fields: {
              VAR: {
                id: CONSTANT.VALUE_ID,
              },
            },
          },
        },
        AT1: {
          block: {
            type: 'math_number',
            id: 'WSk/=6#zLu{^Jb[C{)gJ',
            fields: {
              NUM: 1,
            },
          },
        },
        AT2: {
          block: {
            type: 'math_number',
            id: 'it(^:w,,U10z#=Mb/]=O',
            fields: {
              NUM: 2,
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
            type: 'variables_get',
            id: 'ylBB]C@1abm`5o#Fd,Mo',
            fields: {
              VAR: {
                id: CONSTANT.VALUE_ID,
              },
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
          block: {
            type: 'variables_get',
            id: 'VK$?B)e%T]dMGOD(^RW{',
            fields: {
              VAR: {
                id: CONSTANT.VALUE_ID,
              },
            },
          },
        },
        DELIM: {
          shadow: {
            type: 'text',
            id: '!5Rk?0)RBqjk^js?GZ$o',
            fields: {
              TEXT: ',',
            },
          },
        },
      },
    },
  ],
}
