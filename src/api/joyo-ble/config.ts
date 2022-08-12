
import { ParamsType } from './type'
import type { ResParamsType, ParamsRule } from './type'

export enum CommandType {
  COMMON = 0xB1,
  CONTROL = 0xB2,
  UPGRADE = 0xB3,
  // CONTROL_xxx = '',
}

export enum CommandOrder {
  GET_VERSION = 0x01,
  BEGIN_UPGRADE = 0xC9,
  RESET_UPGRADE = 0xCA,
  READY_AUDIO = 0xCB,
  TRANSFER_AUDIO = 0xCC,

  CONTROL_LIGHT = 0x36,
  CONTROL_MUSIC = 0x37,
  CONTROL_SINGLE_LIGHT = 0x38,
  // CONTROL_LIGHT = 0x36,
}

export const productType = 0xA1

export const Command = { // 需要配置
  COMMON_GET_VERSION: contactHexString(productType, CommandType.COMMON, CommandOrder.GET_VERSION),
  UPGRADE_BEGIN_UPGRADE: contactHexString(productType, CommandType.UPGRADE, CommandOrder.BEGIN_UPGRADE),
  CONTROL_Light: contactHexString(productType, CommandType.CONTROL, CommandOrder.CONTROL_LIGHT), // 编程控制类
  CONTROL_SINGLE_LIGHT: contactHexString(productType, CommandType.CONTROL, CommandOrder.CONTROL_SINGLE_LIGHT), // 编程控制类
  CONTROL_MUSIC: contactHexString(productType, CommandType.CONTROL, CommandOrder.CONTROL_MUSIC), // 编程控制类
  READY_AUDIO: contactHexString(productType, CommandType.UPGRADE, CommandOrder.READY_AUDIO), // 准备传输音频
  TRANSFER_AUDIO: contactHexString(productType, CommandType.UPGRADE, CommandOrder.TRANSFER_AUDIO), // 开始传输音频
}

export const RequestParamsRule = { // 需要配置, todo: 文档说明
  [Command.COMMON_GET_VERSION]: null,
  [Command.UPGRADE_BEGIN_UPGRADE]: {
    // len: 4,
    params: [
      {
        name: 'version',
        len: 9,
        type: ParamsType.VERSION,
      },
    ],
  },
  [Command.READY_AUDIO]: {
    params: [
      {
        name: 'filename',
        len: 4,
        type: ParamsType.STRING,
      },
      {
        name: 'size',
        len: 4,
        type: ParamsType.NUMBER_REVERSE,
      },
    ],
  },
  // [Command.TRANSFER_AUDIO]: {
  //   params: [
  //     {
  //       name: 'order',
  //       len: 2,
  //       type: ParamsType.NUMBER,
  //     },
  //     {
  //       name: 'pack',
  //       len: 235, // 不定长，先尝试235
  //       type: ParamsType.REGION, // 原生传递
  //     },
  //   ],
  // },
  [Command.CONTROL_Light]: {
    hasCallback: false,
    params: [
      {
        name: 'colors',
        len: 36,
        subLen: 3,
        type: ParamsType.NUMBER_ARRAY, // rgb, ff0000
      },
      {
        name: 'bright',
        len: 4,
        type: ParamsType.FLOAT,
      },
    ],
  },
  [Command.CONTROL_SINGLE_LIGHT]: {
    hasCallback: false,
    params: [
      {
        name: 'color',
        len: 3,
        subLen: 3,
        type: ParamsType.NUMBER_ARRAY, // rgb, ff0000
      },
      {
        name: 'num',
        len: 1,
        type: ParamsType.NUMBER,
      },
    ],
  },
  [Command.CONTROL_MUSIC]: {
    hasCallback: false,
    params: [
      {
        name: 'id',
        type: ParamsType.STRING_END, // rgb, ff0000, 需带结束符
      },
    ],
  },
} as Record<string, ResParamsType | null> // todo: type

export const CommandCallbackRule = {
  [Command.COMMON_GET_VERSION]: [
    {
      name: 'version',
      start: 8,
      len: 4,
      type: ParamsType.VERSION,
    },
  ],
  [Command.UPGRADE_BEGIN_UPGRADE]: [
    {
      name: 'status',
      start: 7,
      len: 1,
      type: ParamsType.NUMBER,
    },
  ],
} as Record<string, ParamsRule[]>

export function contactHexString (...args: number[]) {
  return args.reduce((sum, val) => sum + '-' + val.toString(16), '').slice(1)
}
