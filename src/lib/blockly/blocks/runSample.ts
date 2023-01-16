export default {
  blocks: {
    languageVersion: 0,
    blocks: [
      {
        type: 'procedures_defnoreturn',
        id: 'Vi7]U)=bzFF5hocm(/#n',
        x: 30,
        y: 310,
        extraState: {
          params: [
            {
              name: 'value',
              id: 'A[^TV%Y{V^QvxHnM[LP3',
            },
          ],
        },
        icons: {
          comment: {
            text: 'Describe this function...',
            pinned: false,
            height: 80,
            width: 160,
          },
        },
        fields: {
          NAME: 'JOYO_identify',
        },
      },
      {
        type: 'setUp',
        id: 'Svt8=*!d}zLut^KJCU0F',
        x: 30,
        y: 50,
        inputs: {
          main: {
            block: {
              type: 'set_light_animation',
              id: 'dMNn@~t@i9vHR7|Rgne8',
              fields: {
                animation: 'run',
              },
              inputs: {
                time: {
                  shadow: {
                    type: 'math_number',
                    id: 'ge%@|h-ZF,^y|:yBI5*U',
                    fields: {
                      NUM: 5,
                    },
                  },
                },
                color: {
                  block: {
                    type: 'text',
                    id: 'G[8r)3]DUcLz}L*=eKX*',
                    fields: {
                      TEXT: '0xffffff',
                    },
                  },
                },
              },
            },
          },
        },
      },
    ],
  },
  variables: [
    // {
    //   name: 'var',
    //   id: '^48CI*13(Wzy=fo4sNos',
    //   type: 'VAR',
    // },
    {
      name: 'list_1',
      id: 'gZ{g7Ki)!834LpNhd=Xh',
      type: 'LIST',
    },
    {
      name: 'value',
      id: 'A[^TV%Y{V^QvxHnM[LP3',
      type: 'VAR',
    },
    {
      name: 'value_1',
      type: 'VAR',
      id: 'q5oy^YoduR(@}b=yU!;/',
    },
  ],
}
