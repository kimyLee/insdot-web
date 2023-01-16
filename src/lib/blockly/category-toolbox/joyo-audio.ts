import { customKey } from '@/lib/blockly/i18n/zh'

export default {
  kind: 'category',
  name: customKey.TOOLBOX_AUDIO,
  cssConfig: {
    container: 'category-joyo',
  },
  contents: [

    {
      kind: 'block',
      type: 'play_audio',
    },

  ],
}
