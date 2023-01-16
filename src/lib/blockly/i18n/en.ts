import * as BlocklyEn from 'blockly/msg/en'

const customEn = {
  PROCEDURES_DEFNORETURN_TITLE: 'Function',
  PROCEDURES_DEFRETURN_TITLE: 'Function',
  // LISTS_REPEAT_TITLE: '使用重复%2个%1建立列表-en',
  // PROCEDURES_BEFORE_PARAMS: '，传入参数：',
  // PROCEDURES_CALL_BEFORE_PARAMS: '参数：',
  // PROCEDURES_DEFNORETURN_TITLE: '函数',
  // PROCEDURES_DEFRETURN_TITLE: '函数',
  // LISTS_REPEAT_TITLE: '使用重复%2个%1建立列表',
  // toolbox 名称
  TOOLBOX_LIGHT: 'Light',
  TOOLBOX_AUDIO: 'Audio',
  TOOLBOX_IDENTIFY: 'Identify',
  TOOLBOX_LOGIC: 'Logic',
  TOOLBOX_LOOP: 'Loop',
  TOOLBOX_MATH: 'Math',
  TOOLBOX_STRING: 'String',
  TOOLBOX_VAR: 'Var',
  TOOLBOX_LIST: 'List',
  TOOLBOX_FUNC: 'Function',
  TOOLBOX_TOOL: 'Tool',

  // 灯效Block
  LIGHT_SET_BY_UI: 'set lights %1',
  LIGHT_SET_BY_ARRAY: 'set lights with array %1',
  LIGHT_SET_ALL_BY_COLOR: 'use color %1 to set all light',
  LIGHT_SET_ALL_BY_RGB: 'use color R: %1G:%2B:%3 to set all light',
  LIGHT_SET_ANIMATION: 'play animation %1, last %2 seconds and with color %3',
  LIGHT_CLEAR_ALL: 'clear all light',
  LIGHT_RUN: 'Pinwheel', // 跑马灯
  LIGHT_BREATH: 'Breath',
  LIGHT_BLINK: 'twinkling',
  LIGHT_BOOM: 'Boom',

  // 音效block
  AUDIO_PLAY_AUDIO: 'play %1 audio',
  AUDIO_WIN: 'Win',
  AUDIO_WRONG: 'Fail',
  AUDIO_GAME_BEGIN_1: 'begin 1',
  AUDIO_GAME_BEGIN_2: 'begin 2',
  AUDIO_GAME_BEGIN_3: 'begin 3',
  AUDIO_COUNT_DOWN: 'COUNT DOWN',
  AUDIO_COUNT_LAST: 'COUNT DOWN END',
  AUDIO_MOVE_1: 'MOVE 1',
  AUDIO_MOVE_2: 'MOVE 2',
  AUDIO_MOVE_3: 'MOVE 3',
  AUDIO_MOVE_4: 'MOVE 4',
  AUDIO_MOVE_5: 'MOVE 5',
  AUDIO_MATCH_1: 'MATCH 1',
  AUDIO_MATCH_2: 'MATCH 2',
  AUDIO_MATCH_3: 'MATCH 3',
  AUDIO_MATCH_4: 'MATCH 4',
  AUDIO_MATCH_5: 'MATCH 5',
  AUDIO_HRED: 'HRED',
  AUDIO_FIND_NOTHING: 'FIND NOTHING',
  AUDIO_FIND_TARGET: 'FIND TARGET',
  AUDIO_FIND_TARGET_2: 'FIND TARGET 2',
  AUDIO_CHECK: 'CHECK',
  AUDIO_DO: 'DO',
  AUDIO_RE: 'RE',
  AUDIO_MI: 'MI',
  AUDIO_FA: 'FA',
  AUDIO_SO: 'SO',
  AUDIO_LA: 'LA',
  AUDIO_XI: 'XI',

  // 识别block
  IDENTIFY_LETTER: 'letter %1',
  IDENTIFY_NUMBER: 'number %1',
  IDENTIFY_SYMBOL: 'symbols %1',
  IDENTIFY_EMPTY_CARD: 'empty card No: %1',
  IDENTIFY_COLOR_CARD: 'color card %1',
  IDENTIFY_STICKER: 'transparent sticker No: %1',
  IDENTIFY_ID: 'ID value： %1',

  // 辅助block
  TOOL_SETUP: 'start game %1 %2',
  TOOL_PRINT: 'print %1 in debug window',
  TOOL_PRINT_ANY: 'print %1 in debug window',
  TOOL_WAIT: 'wait %1 second',
  TOOL_CURRENT_TIME: 'current timestamp(ms)',

  // 列表Block
  LIST_INCLUDE: '列表 %1 包含 %2 ？',
  LIST_PUSH: 'add %1 末尾添加 %2',
}

export default {
  ...BlocklyEn,
  ...customEn,
}
