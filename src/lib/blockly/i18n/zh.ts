import * as BlocklyZh from 'blockly/msg/zh-hans'

const customZh = {
  PROCEDURES_BEFORE_PARAMS: '，传入参数：',
  PROCEDURES_CALL_BEFORE_PARAMS: '参数：',
  PROCEDURES_DEFNORETURN_TITLE: '函数',
  PROCEDURES_DEFRETURN_TITLE: '函数',
  LISTS_REPEAT_TITLE: '使用重复%2个%1建立列表',
  // toolbox 名称
  TOOLBOX_LIGHT: '灯效',
  TOOLBOX_AUDIO: '音效',
  TOOLBOX_IDENTIFY: '识别',
  TOOLBOX_LOGIC: '判断',
  TOOLBOX_LOOP: '循环',
  TOOLBOX_MATH: '运算',
  TOOLBOX_STRING: '字符串',
  TOOLBOX_VAR: '变量',
  TOOLBOX_LIST: '列表',
  TOOLBOX_FUNC: '函数',
  TOOLBOX_TOOL: '辅助',

  // 灯效Block
  LIGHT_SET_BY_UI: '设置灯效 %1',
  LIGHT_SET_BY_ARRAY: '使用数组或变量 %1 设置灯效',
  LIGHT_SET_ALL_BY_COLOR: '使用颜色 %1 设置所有灯',
  LIGHT_SET_ALL_BY_RGB: '使用颜色R: %1G:%2B:%3设置所有灯',
  LIGHT_SET_ANIMATION: '使用灯效动画%1 ，持续%2秒，颜色%3',
  LIGHT_CLEAR_ALL: '熄灭所有灯',
  LIGHT_RUN: '跑马灯',
  LIGHT_BREATH: '呼吸',
  LIGHT_BLINK: '闪烁',
  LIGHT_BOOM: '爆炸',

  // 音效Block
  AUDIO_PLAY_AUDIO: '播放 %1 音效',
  AUDIO_WIN: '胜利',
  AUDIO_WRONG: '失败',
  AUDIO_GAME_BEGIN_1: '开始1',
  AUDIO_GAME_BEGIN_2: '开始2',
  AUDIO_GAME_BEGIN_3: '开始3',
  AUDIO_COUNT_DOWN: '倒计时',
  AUDIO_COUNT_LAST: '倒计时结束',
  AUDIO_MOVE_1: '移动 1',
  AUDIO_MOVE_2: '移动 2',
  AUDIO_MOVE_3: '移动 3',
  AUDIO_MOVE_4: '移动 4',
  AUDIO_MOVE_5: '移动 5',
  AUDIO_MATCH_1: '匹配 1',
  AUDIO_MATCH_2: '匹配 2',
  AUDIO_MATCH_3: '匹配 3',
  AUDIO_MATCH_4: '匹配 4',
  AUDIO_MATCH_5: '匹配 5',
  AUDIO_HRED: 'HRED',
  AUDIO_FIND_NOTHING: '无发现',
  AUDIO_FIND_TARGET: '发现目标 1',
  AUDIO_FIND_TARGET_2: '发现目标 2',
  AUDIO_CHECK: '检查',
  AUDIO_DO: 'do',
  AUDIO_RE: 'RE',
  AUDIO_MI: 'MI',
  AUDIO_FA: 'FA',
  AUDIO_SO: 'SO',
  AUDIO_LA: 'LA',
  AUDIO_XI: 'XI',

  // 识别block
  IDENTIFY_LETTER: '字母 %1',
  IDENTIFY_NUMBER: '数字 %1',
  IDENTIFY_SYMBOL: '符号 %1',
  IDENTIFY_EMPTY_CARD: '空白卡牌编号 %1',
  IDENTIFY_COLOR_CARD: '颜色卡牌 %1',
  IDENTIFY_STICKER: '透明贴纸编号 %1',
  IDENTIFY_ID: 'ID值： %1',

  // 辅助block
  TOOL_SETUP: '开始游戏 %1 %2',
  TOOL_PRINT: '调试台显示%1的值',
  TOOL_PRINT_ANY: '调试台显示%1的值',
  TOOL_WAIT: '等待%1秒',
  TOOL_CURRENT_TIME: '当前时间戳（毫秒）',

  // 列表Block
  LIST_INCLUDE: '列表 %1 包含 %2 ？',
  LIST_PUSH: '在列表 %1末尾添加%2.',
}

export default {
  ...BlocklyZh,
  ...customZh,
}

export const customKey = {} as typeof customZh

Object.keys(customZh).forEach((ele) => {
  // (customKey as any)[ele] = ele
  (customKey as any)[ele] = `%{BKY_${ele}}`
})
