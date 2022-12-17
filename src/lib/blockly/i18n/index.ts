
import Blockly from 'blockly'

const locale = {
  AUDIO_PLAY_AUDIO: {
    zh: '播放 %1 音效',
    en: 'play %1 audio',
  },
  AUDIO_WIN: {
    zh: '胜利',
    en: 'Win',
  },
  AUDIO_WRONG: {
    zh: '失败',
    en: 'Fail',
  },
  AUDIO_GAME_BEGIN_1: {
    zh: '开始1',
    en: 'begin 1',
  },
  AUDIO_GAME_BEGIN_2: {
    zh: '开始2',
    en: 'begin 2',
  },
  AUDIO_GAME_BEGIN_3: {
    zh: '开始3',
    en: 'begin 3',
  },
  AUDIO_COUNT_DOWN: {
    zh: '倒计时',
    en: 'COUNT DOWN',
  },
  AUDIO_COUNT_LAST: {
    zh: '倒计时结束',
    en: 'COUNT DOWN END',
  },
  AUDIO_MOVE_1: {
    zh: '移动 1',
    en: 'MOVE 1',
  },
  AUDIO_MOVE_2: {
    zh: '移动 2',
    en: 'MOVE 2',
  },
  AUDIO_MOVE_3: {
    zh: '移动 3',
    en: 'MOVE 3',
  },
  AUDIO_MOVE_4: {
    zh: '移动 4',
    en: 'MOVE 4',
  },
  AUDIO_MOVE_5: {
    zh: '移动 5',
    en: 'MOVE 5',
  },
  AUDIO_MATCH_1: {
    zh: '匹配 1',
    en: 'MATCH 1',
  },
  AUDIO_MATCH_2: {
    zh: '匹配 2',
    en: 'MATCH 2',
  },
  AUDIO_MATCH_3: {
    zh: '匹配 3',
    en: 'MATCH 3',
  },
  AUDIO_MATCH_4: {
    zh: '匹配 4',
    en: 'MATCH 4',
  },
  AUDIO_MATCH_5: {
    zh: '匹配 5',
    en: 'MATCH 5',
  },
  AUDIO_HRED: {
    zh: 'HRED',
    en: 'HRED',
  },
  AUDIO_FIND_NOTHING: {
    zh: '无发现',
    en: 'FIND NOTHING',
  },
  AUDIO_FIND_TARGET: {
    zh: '发现目标 1',
    en: 'FIND TARGET',
  },
  AUDIO_FIND_TARGET_2: {
    zh: '发现目标 2',
    en: 'FIND TARGET 2',
  },
  AUDIO_CHECK: {
    zh: '检查',
    en: 'CHECK',
  },
  AUDIO_DO: {
    zh: 'do',
    en: 'DO',
  },
  AUDIO_RE: {
    zh: 'RE',
    en: 'RE',
  },
  AUDIO_MI: {
    zh: 'MI',
    en: 'MI',
  },
  AUDIO_FA: {
    zh: 'FA',
    en: 'FA',
  },
  AUDIO_SO: {
    zh: 'SO',
    en: 'SO',
  },
  AUDIO_LA: {
    zh: 'LA',
    en: 'LA',
  },
} as any

// todo: 改为直接观测getter，效率会高些，现在是直接改Blockly.Msg
export function setLocale (lang = 'en') {
  const obj = {} as any
  for (const item in locale) {
    obj[item] = locale[item][lang]
  }
  Blockly.Msg = Object.assign(Blockly.Msg, obj)
}
