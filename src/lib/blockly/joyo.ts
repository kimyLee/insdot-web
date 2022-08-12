export default {
  kind: 'category',
  name: 'JOYO',
  contents: [
    {
      kind: 'block',
      type: 'setUp',
    },
    {
      kind: 'block',
      type: 'wait_second',
    },
    {
      kind: 'block',
      type: 'play_audio',
    },
    {
      kind: 'block',
      type: 'set_light',
    },
    {
      kind: 'block',
      type: 'set_all_light',
    },
    {
      kind: 'block',
      type: 'set_all_light_color',
    },
    // {
    //   kind: 'block',
    //   type: 'colour_picker',
    // },
    {
      kind: 'block',
      type: 'consolelog',
    },
  ],
}