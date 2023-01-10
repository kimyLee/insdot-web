export default {
  kind: 'category',
  name: '运算',
  cssConfig: {
    container: 'category-math',
  },
  contents: [
    {
      kind: 'block',
      type: 'math_number',
    },
    {
      kind: 'block',
      type: 'math_arithmetic',
      fields: { // 选项为field的name
        OP: 'ADD',
      },
      inputs: { // 选项为value的name，input有三种，value，state,dummy
        A: {
          shadow: {
            type: 'math_number',
            fields: {
              NUM: 1,
            },
          },
        },
        B: {
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
      type: 'math_single',
      inputs: { // 选项为value的name，input有三种，value，state,dummy
        NUM: {
          shadow: {
            type: 'math_number',
            fields: {
              NUM: 9,
            },
          },
        },
      },
    },
    {
      kind: 'block',
      type: 'math_trig',
      inputs: {
        NUM: {
          shadow: {
            type: 'math_number',
            fields: {
              NUM: 45,
            },
          },
        },
      },
    },
    {
      kind: 'block',
      type: 'math_constant',
    },

    {
      kind: 'block',
      type: 'math_number_property',
      inputs: {
        NUMBER_TO_CHECK: {
          shadow: {
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
      type: 'math_round',
      inputs: {
        NUM: {
          shadow: {
            type: 'math_number',
            fields: {
              NUM: 3.1,
            },
          },
        },
      },
    },
    {
      kind: 'block',
      type: 'math_on_list',
      inputs: {
        LIST: {
          block: {
            type: 'variables_get_list',
            fields: {
              VAR: {
                type: 'LIST',
                name: 'list',
              },
            },
          },
        },
      },
    },
    {
      kind: 'block',
      type: 'math_modulo',
      inputs: {
        DIVIDEND: {
          shadow: {
            type: 'math_number',
            fields: {
              NUM: 64,
            },
          },
        },
        DIVISOR: {
          shadow: {
            type: 'math_number',
            fields: {
              NUM: 10,
            },
          },
        },
      },
    },
    {
      kind: 'block',
      type: 'math_constrain',
      inputs: {
        VALUE: {
          shadow: {
            type: 'math_number',
            fields: {
              NUM: 50,
            },
          },
        },
        LOW: {
          shadow: {
            type: 'math_number',
            fields: {
              NUM: 1,
            },
          },
        },
        HIGH: {
          shadow: {
            type: 'math_number',
            fields: {
              NUM: 100,
            },
          },
        },
      },
    },
    {
      kind: 'block',
      type: 'math_random_int',
      inputs: {
        FROM: {
          shadow: {
            type: 'math_number',
            fields: {
              NUM: 1,
            },
          },
        },
        TO: {
          shadow: {
            type: 'math_number',
            fields: {
              NUM: 100,
            },
          },
        },
      },

    },
    {
      kind: 'block',
      type: 'math_random_float',
    },
    {
      kind: 'block',
      type: 'math_atan2',
    },

  ],
}
