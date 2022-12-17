export default {
  kind: 'category',
  name: 'JOYO',
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
    {
      kind: 'block',
      type: 'set_light_animation',
    },
    {
      kind: 'block',
      type: 'clear_light',
    },
    // {
    //   kind: 'block',
    //   type: 'colour_picker',
    // },
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
